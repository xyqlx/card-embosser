# 创建局域网可用的证书

> 使用本地CA或者第三方购买的证书也是一个选择。

这里我们使用自签名证书，并把CA证书安装到客户端。

## 生成CA证书

```powershell
openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 90 -key ca.key -out ca.crt
# 生成pfx格式
openssl pkcs12 -export -in ca.crt -inkey ca.key -out ca.pfx
```

## 生成服务器证书

```powershell
openssl genrsa -out server.key 2048
```

创建一个配置文件，例如server.cnf。这一步骤主要是为了提供浏览器需要校验的Subject Alternative Name（SAN）字段，避免出现ERR_CERT_COMMON_NAME_INVALID错误

```ini
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
countryName = CN
stateOrProvinceName = Beijing
localityName = Beijing
organizationName = xyqlx
commonName = card-embosser.xyqlx

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = your domain
IP.1 = your ip
```

```powershell
# 创建证书签名请求，这里的密码用于防止他人未经授权使用CSR生成证书
openssl req -new -key server.key -out server.csr -config server.cnf
# 使用CA证书签名
openssl x509 -req -days 90 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -extensions v3_req -extfile server.cnf
# 生成pfx格式
openssl pkcs12 -export -in server.crt -inkey server.key -out server.pfx
```

## 在需要的Windows客户端安装CA证书

双击`ca.crt`，选择安装到本地计算机的“受信任的根证书颁发机构”。

## 如果Android客户端允许，在Android客户端安装CA证书

将`ca.crt`发送到Android设备安装。

## 使用IIS测试是否可行

将服务器pfx证书安装到本地计算机的“个人”证书库，然后打开IIS，选择“绑定”设置HTTPS，包括端口、IP地址与证书，最后打开SSL设置，选择要求SSL并忽略客户证书，启动网站。

若客户端浏览器访问时不再提示证书相关的警告或错误，即证明证书配置成功。
