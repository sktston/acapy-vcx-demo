# ACA-PY & VCX Demo

This is a ACA-PY & VCX Demo.

![Demo Architecture](./img/architecture.png)

**Note**: This library is currently in experimental state.

* Demo source : 
* ACA-PY : https://github.com/hyperledger/aries-cloudagent-python
* VCX Agency : https://github.com/AbsaOSS/vcxagencynode
* Libvcx(Aries-vcx) : https://github.com/hyperledger/aries-vcx
* Indy VON Network : https://github.com/bcgov/von-network
* Indy tails file server : https://github.com/bcgov/indy-tails-server
* PostgreSQL : https://www.postgresql.org/


## Run Demo
- The demo represents example how 3 actors, **Alice**, **Faber(Issuer)**  and **Faber(Verifier)** institution, exchange credentials.
- They may consult Indy blockchain (pool of Indy nodes)  to find out certain pieces of information. **Faber**
and **Alice** are represented by 2 scripts `faber.js` and `alice.js` but you could imagine that there's a webserver
running code alike what's inside `faber.js` and there's a perhaps smartphone or laptop running code
alike in `alice.js`.
- **Faber** and **Alice** in the demo also don't exchange the credentials peer to peer. Instead, the exchange happens
through intermediary service represented by **Dummy Cloud Agent**. The data **Alice** and **Faber** are exchanging over
**Dummy Cloud Agent** are however encrypted and cannot be read by the **Dummy Cloud Agent**. The **Dummy Cloud Agent**
is something like illiterate postman. He'll take a letter from one party and delivers it to the other party. But he's
unable to read the messages he's handling.

### Pre-requirements
#### Docker
Before you'll be able to run demo, you need docker 
- Docker Engine, Docker Compose : https://www.docker.com/

#### VON-NETWORK
You'll also have to run pool of Indy nodes on your machine. You can achieve by simply running a docker container
which encapsulates multiple interconnected Indy nodes.
```shell script
git clone https://github.com/bcgov/von-network
cd von-network
./manage build
./manage start
```

#### Tails file server
You need tails server for credential Revocation tests.
```shell script
git clone https://github.com/bcgov/indy-tails-server
cd indy-tails-server/docker
./manage start
```

#### ACA-PY & VCX Cloud Agent

```shell script
git clone https://github.com/bcgov/indy-tails-server
cd indy-tails-server/docker
./manage start
```


