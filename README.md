####ionic notification push示例
1,创建ionic项目【项目环境配置就不多说了】
```
$ ionic start PushNotification tabs
```
注意：项目需要引入ng-cordova.js，在网上下载一个ng-cordova.js文件到项目的lib目录，然后咋index.html中引入

2,安装插件，废话不多说直接复制命令执行
```
$ ionic plugin add org.apache.cordova.console
$ ionic plugin add org.apache.cordova.device
$ ionic plugin add org.apache.cordova.dialogs    
$ ionic plugin add org.apache.cordova.file
$ ionic plugin add org.apache.cordova.media
$ ionic plugin add https://github.com/phonegap-build/PushPlugin
$ ionic plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
```

3，项目准备完成，现在可以开始证书的生成了
首先，我们需要在本机生成一个钥匙串
**打开钥匙串**
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/30A017AA-4E53-40C6-B018-7DAAEF46FAA4.png)

**从证书颁发机构请求证书**
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/56AE78CC-4DC4-4106-881B-FEDF3A106C7C.png)
按照引导步骤输入你的邮箱姓名等信息，一路向下就行了，会生成一个*.certSigningRequest文件，先别管它，保存起来，后面要用到

**登陆apple开发者中心**
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/8E46A9BC-CD61-45D5-B42F-C7E70B15DA89.png)
点击***Certificates, Identifiers & Profiles***进入下一个页面选择***IOS Apps***选择框中的***Certificates***，然后会进入证书列表页面
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/E57B87C9-503A-4D6A-BC06-5F27C8F68BBF.png)

点击右上角的**+**号
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/6C50A3BD-6830-4C81-A736-7FEAE17D1E4A.png)

填写证书的一些基本信息
注意：需要选择上**push notification** 如下图
 ![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/583AC394-A030-417E-AB5E-9C78989489E6.png)


一步步走下去,一直到最后一步需要你选择一个文件，如下图
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/40ECD93A-27FA-45D2-A522-797FCFC27B3E.png)
这个时候你需要使用到前面***从证书颁发机构请求证书***步骤中生成的*.certSigningRequest文件，然后点下面的按钮生成
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/873A1E7C-B5AB-44BD-8F28-AB4D41B89818.png)

将**aps_development.cer**文件下载下来保存

然后双击**aps_development.cer**文件注册到钥匙串中，进入钥匙串导出一个*.p12文件【需要设置密码，最好设置一个比较容易记住的】如下图
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/47F0CCA5-7237-457E-A38F-850095A719D9.png)
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/DDC579AD-D126-469B-9699-607456FB453F.png)
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/21D0C40D-4137-4BF4-A543-A38F3BD089D8.png)

经过上面的步骤会导出一个.p12文件，如"push-demo-dev.p12"
至此，已经获取了一个.cer文件，一个.p12文件
从命令行进入文件目录执行以下命令
```
$ openssl x509 -in aps_development-push-demo.cer -inform der -out PushChatCert.pem

$ openssl pkcs12 -nocerts -out PushChatKey.pem -in push-demo-dev.p12

$ cat PushChatCert.pem PushChatKey.pem > ck.pem

$ openssl s_client -connect gateway.sandbox.push.apple.com:2195 -cert PushChatCert.pem  -key PushChatKey.pem
```

最后一条命令是检测生成的文件是否有效的，如果出现下面的一串信息则说明证书有效
```
Certificate chain
 0 s:/C=US/ST=California/L=Cupertino/O=Apple Inc./CN=gateway.sandbox.push.apple.com
   i:/C=US/O=Entrust, Inc./OU=www.entrust.net/rpa is incorporated by reference/OU=(c) 2009 Entrust, Inc./CN=Entrust Certification Authority - L1C
 1 s:/C=US/O=Entrust, Inc./OU=www.entrust.net/rpa is incorporated by reference/OU=(c) 2009 Entrust, Inc./CN=Entrust Certification Authority - L1C
   i:/O=Entrust.net/OU=www.entrust.net/CPS_2048 incorp. by ref. (limits liab.)/OU=(c) 1999 Entrust.net Limited/CN=Entrust.net Certification Authority (2048)
---
......
```

执行完上面的命令，我们会得到两个文件**PushChatCert.pem** **PushChatKey.pem** ,这两个文件是来进行apns与app进行通信的凭证，在发送推送消息的时候我们需要使用到上面的两个文件

至此，我们已经准备好发送推送消息的条件，在ionic中 我们需要将config.xml中的widget id设置为我们生成的apple id 如下图
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/6142372B-B6A7-48D5-8E9B-225358225DEB.png)

ok，现在我们到项目的根目录执行下面两个命令
```
ionic platform add ios
ionic build
```
然后用xcode打开生成的*.xcodeproj文件 然后做以下设置
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/09744F61-8FB4-4945-969F-C69A203D61FD.png)

运行项目将app安装到实体机上
以下是执行的效果图
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/IMG_1917.PNG)![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/IMG_1918.PNG)![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/IMG_1919.PNG)
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/IMG_1921.PNG)
![Alt text](https://github.com/noahxinhao/PushNotification/blob/master/resources/img/IMG_1920.PNG)

======================================================================================================
以上为app的操作
消息推送的服务端代码请见
https://github.com/noahxinhao/pushServer


