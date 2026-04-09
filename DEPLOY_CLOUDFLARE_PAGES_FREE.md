# Cloudflare Pages 免费发布（Banana Climbing Store）

这套方案是无服务器架构，前端放 Cloudflare Pages，数据库继续用你现在的 Supabase。

## 1. 先拿到免费网址

1. 打开 Cloudflare Pages 控制台，创建一个 Pages 项目。
2. 项目名建议填：`banana-climbing-store`。
3. 创建完成后会得到默认网址：`https://banana-climbing-store.pages.dev`。  
   如果名字已被占用，就改成 `banana-climbing-store-cn` 之类。

## 2. 配置 GitHub 自动发布

仓库已内置工作流：`/.github/workflows/deploy-cloudflare-pages.yml`

去 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 添加：

1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`
3. `CLOUDFLARE_PAGES_PROJECT`  
   填你创建的项目名，比如 `banana-climbing-store`

## 3. API Token 权限建议

创建 Cloudflare API Token 时给 Pages 发布权限即可。  
如果不确定，先用 Cloudflare 提供的 Pages 相关模板，再按最小权限收敛。

## 4. 首次发布

1. `git push origin main`
2. 去 GitHub `Actions` 看 `Deploy To Cloudflare Pages (Free)` 成功。
3. 打开 `https://你的项目名.pages.dev` 验证访问。

## 5. 可选：绑定自己的域名

Pages 支持免费绑定自定义域名。  
如果你有 `bananaclimbingstore.com`，可以绑成 `shoe.bananaclimbingstore.com`。

