# ListenKVAndAutoUpdate
# KV触发自动更新WORKERS

### 这个是一个通过 Cloudflare Workers 搭建，定期检查 Workers KV 中的数据变化，比较当前的数据与上次的数据，如果有变化，则触发自动更新Cloudflare Workers应用。

# 绑定KV namespace。

### 创建命名空间：
Workers 和 Pages -> 创建命名空间，例如变量名称为"KV", KV 命名空间为"txt"。

### 命名空间：
Workers 和 Pages -> 本应用 -> 设置 -> 变量 -> KV 命名空间绑定，输入"KV"，选定"txt"。


# 变量说明
|      变量名   |  示例 | 备注 | 
|-----------------|-----------------------------------------|-------------------------------------------------------------------------------------------------|
| CF_ACCOUNT_ID   | d2da6ad0a3573bc5141c31234567890         |  Cloudflare 仪表板 -> Workers & Pages -> Overviewy页面右侧边栏中，账户的一些基本信息，其中包括账户 ID  |
| CF_SCRIPT_NAME  | dingyueqi                               | 被触发重试部署的Workers应用脚本ID。编辑页面的URL，例如 https://dash.cloudflare.com/d2da123456478945612366313f/workers/services/edit/dingyueqi/production，那么 dingyueqi 就是你的脚本的 ID  | 
| CF_PROJECT_NAME | dingyueqi                               | 被触发重试部署的Pagess应用项目名。Pages页面的URL，例如 https://dash.cloudflare.com/d2da6ad0ada12345647894561/pages/view/dingyueqi，那么 dingyueqi 就是你的站点 ID                          | 
| CF_API_TOKEN    | uCcNTskdlgksdgklskdjgklsdgdkgyXbDD6CWf0 | 控制台->点击页面右上角的头像->我的资料->API 令牌，点击 "Create Token"。                               |
| KV_NAMESPACE    | txt   
