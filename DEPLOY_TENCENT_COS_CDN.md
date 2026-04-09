# 腾讯云 COS + CDN 迁移指南

这个项目已经内置自动发布流程：`main` 分支每次 push，会自动同步静态文件到 COS。

## 1. 架构

1. 页面文件托管在 COS（对象存储）。
2. 外网访问走 CDN 域名（建议绑定你自己的主域名）。
3. 数据仍走 Supabase（不用自建服务器）。

## 2. 腾讯云侧一次性配置

1. 创建 COS 存储桶，推荐区域选离主要用户近的区域（例如广州/上海）。
2. 开启静态网站功能。
3. 静态网站配置里把首页文档设置为 `index.html`，错误文档设置为 `index.html`。
4. 在 CDN 控制台添加加速域名，源站类型选 COS。
5. 回源地址请优先使用 COS 的静态网站源站域名，不要直接用默认下载域名。
6. 给 CDN 域名配置 HTTPS 证书。
7. 在域名 DNS 里把业务域名 CNAME 到 CDN 分配的目标域名。

## 3. GitHub 仓库 Secrets 配置

在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 中新增：

1. `TENCENT_SECRET_ID`
2. `TENCENT_SECRET_KEY`
3. `TENCENT_COS_BUCKET`  
   示例：`your-bucket-1250000000`
4. `TENCENT_COS_REGION`  
   示例：`ap-guangzhou`
5. `TENCENT_COS_PATH_PREFIX`（可选）  
   默认留空即发布到桶根目录。  
   如果你要发布到子目录，可填 `xc`，会同步到 `/xc/`。

## 4. 自动发布使用方式

1. 提交并推送代码到 `main`。
2. 在 GitHub 的 `Actions` 页面查看 `Deploy To Tencent COS` 工作流。
3. 工作流成功后，用 CDN 域名打开站点验证。

## 5. 缓存建议（减少“有人看到旧页面”）

1. 对 `*.html` 设置较短缓存（例如 1-5 分钟）。
2. 对 `*.css`、`*.js`、图片设置较长缓存（7-30 天）。
3. 每次发版继续保留文件版本号参数（当前项目已使用 `?v=...`）。

## 6. 常见问题

1. 访问直接下载文件而不是打开网页  
   检查 CDN 回源是否使用“静态网站源站域名”。
2. 少数地区访问慢或偶发失败  
   检查是否走 CDN 域名，而不是 COS 默认域名或 GitHub Pages 域名。
3. 页面更新后有人仍旧看到旧版本  
   检查 CDN 缓存规则，必要时手动刷新 CDN 缓存。

## 7. 当前已内置的自动发布文件

`/.github/workflows/deploy-cos.yml`

