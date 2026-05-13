# dazyhub

## 开发启动

先启动后端：

```bash
cd backend
mvn spring-boot:run
```

后端默认运行在 `http://localhost:8080`。数据库配置从 `backend/src/main/resources/application.properties` 读取，当前默认值是：

```text
DB_URL=jdbc:postgresql://192.168.100.168:5433/dazyhub
DB_USERNAME=postgres
DB_PASSWORD=cym1754544
```

如果需要覆盖默认配置，可以在启动时传入环境变量：

```bash
cd backend
DB_USERNAME=postgres DB_PASSWORD=cym1754544 JWT_SECRET=change-this-to-a-long-random-secret mvn spring-boot:run
```

再打开另一个终端启动前端：

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。Vite 开发服务器会把 `/api` 和 `/uploads` 代理到 `http://localhost:8080`。

生产构建：

```bash
cd frontend
npm run build
```
