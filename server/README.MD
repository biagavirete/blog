# Server - blog

Server for the blog application developed using Node, Express and MongoDB.
Important: to run the application you need to have MongoDB installed.

## Getting started

**Installing**
> Cloning the repository

```bash
$ git clone https://github.com/biagavirete/blog.git
$ cd blog
$ cd server
```

> Installing dependencies

```bash
$ npm install
```

**Running API**

> Running MongoDB

```bash
$  mongod --dbpath ./mongo-db-data/
```

> Connecting to Mongo Shell and addint initial data

```bash
$  mongo
$  use react-blog-db
$  db.articles.insertMany([ { name: 'learn-react', upvotes: 0, comments: [] }, { name: 'learn-node', upvotes: 0, comments: [] }, { name: 'mongodb', upvotes: 0, comments: [] }])
```

> Running server:

```bash
$ npm run dev
```

## Built with

* Typescript
* React
* Redux
* Axios
* React-router-dom
* React-helmet
* SASS