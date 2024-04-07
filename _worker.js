addEventListener('scheduled', event => {
    event.waitUntil(handleScheduledEvent(event))
  })
  
  async function handleScheduledEvent(event) {
    try {
      const currentData = await getAllKVData()
      const previousData = await getPreviousData()
  
      if (!isDataEqual(currentData, previousData)) {
        await triggerAutoUpdate()
      }
  
      await saveCurrentData(currentData)
    } catch (error) {
      console.error('An error occurred while handling scheduled event:', error)
    }
  }
  
  async function getAllKVData() {
    const namespace = process.env.KV_NAMESPACE || 'txt'
    const kvEntries = KV.list({ namespace })
    const data = {}
  
    for await (const { key, value } of kvEntries) {
      data[key] = await KV.get(key, { namespace })
    }
  
    return data
  }
  
  async function getPreviousData() {
    return await KV.get('previous_data')
  }
  
  async function saveCurrentData(data) {
    await KV.put('previous_data', JSON.stringify(data))
  }
  
  function isDataEqual(data1, data2) {
    return JSON.stringify(data1) === JSON.stringify(data2)
  }
  
  async function triggerAutoUpdate() {
    const accountId = process.env.CF_ACCOUNT_ID
    const apiToken = process.env.CF_API_TOKEN
  
    let apiUrl;
    if (process.env.CF_SCRIPT_NAME) {
      const script_name = process.env.CF_SCRIPT_NAME;
      apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${script_name}/deployments`;
    } else if (process.env.CF_PROJECT_NAME) {
      const project_name = process.env.CF_PROJECT_NAME;
      const latestDeployment = await getLatestDeploymentId(accountId, project_name);
      apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project_name}/deployments/${latestDeployment}/retry`;
    } else {
      console.error('No CF_SCRIPT_NAME or CF_PROJECT_NAME environment variable found.');
      return;
    }
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Automatic deployment triggered by KV update' })
    });
  
    if (response.ok) {
      console.log('Deployment triggered successfully.');
    } else {
      console.error('Failed to trigger deployment:', response.statusText);
    }
  }
  
  async function getLatestDeploymentId(accountId, project_name) {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project_name}/deployments`);
    const data = await response.json();
    return data.result[0].id; // 假设最新的部署在数组的第一个位置
  }
