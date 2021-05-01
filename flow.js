[{"id":"e352564b.81a5a8","type":"uibuilder","z":"6aced84a.4d4208","name":"Vuetify Test","topic":"","url":"d-test","fwdInMessages":false,"allowScripts":false,"allowStyles":false,"copyIndex":false,"templateFolder":"vue-simple","showfolder":false,"useSecurity":false,"sessionLength":"","tokenAutoExtend":false,"oldUrl":"d/test","x":430,"y":420,"wires":[["cf26c3e3.a30e5"],["b6161535.0f1708","353a0881.e7f568"]]},{"id":"cf26c3e3.a30e5","type":"debug","z":"6aced84a.4d4208","name":"vuetify input","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":670,"y":400,"wires":[]},{"id":"b6161535.0f1708","type":"debug","z":"6aced84a.4d4208","name":"vuetify ctrl","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":660,"y":440,"wires":[]},{"id":"39f6e7a2.ccfe78","type":"function","z":"6aced84a.4d4208","name":"address","func":"return {\n    topic: \"orchard-state\",\n    payload: msg.payload,\n};","outputs":1,"noerr":0,"initialize":"","finalize":"","x":400,"y":700,"wires":[["4c424257.62922c"]]},{"id":"4c424257.62922c","type":"link out","z":"6aced84a.4d4208","name":"","links":["db451344.9f853"],"x":515,"y":700,"wires":[]},{"id":"353a0881.e7f568","type":"function","z":"6aced84a.4d4208","name":"uib cache","func":"// Expects input msgs with topic set\n\nlet cache = context.get('cache') || {};\n\n// Replay cache if requested\nif (msg.hasOwnProperty('cacheControl') && msg.cacheControl === 'REPLAY' &&\n        msg.uibuilderCtrl === 'ready for content') {\n    for (var topic in cache) {\n        // Only send to a single client if we can\n        if (msg.hasOwnProperty('_socketId'))\n            node.send({\n                \"topic\": topic, \n                \"payload\": cache[topic],\n                \"_socketId\": msg._socketId\n            });\n        else\n            node.send({\n                \"topic\": topic, \n                \"payload\": cache[topic]\n            });\n    }\n    return null;\n}\n\n// ignore cacheControl and uibuilder control messages\nif (msg.hasOwnProperty('cacheControl') || msg.hasOwnProperty('uibuilderCtrl')) return null;\n\n// Keep the last msg.payload by topic\n//if (!msg.payload.hasOwnProperty('at')) msg.payload.at = Date.now();\nif (msg.hasOwnProperty('cache') && !msg.cache) {\n    // skip caching\n} else {\n    cache[msg.topic] = msg.payload;\n    context.set('cache', cache);\n}\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":400,"y":380,"wires":[["e352564b.81a5a8"]]},{"id":"db451344.9f853","type":"link in","z":"6aced84a.4d4208","name":"dash/test","links":["4c424257.62922c","ab648ebf.83598","ad1e039d.f00c"],"x":120,"y":380,"wires":[["353a0881.e7f568"]],"l":true},{"id":"bded7e2b.887f5","type":"inject","z":"6aced84a.4d4208","name":"locations","props":[{"p":"payload"}],"repeat":"10","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"[\"bedroom\",\"garden oak\",\"gh-air\",\"gh-ceil\",\"guest room\",\"house\",\"study\",\"weather-antenna\"]","payloadType":"json","x":150,"y":820,"wires":[["7d0a3f68.5b481"]]},{"id":"7d0a3f68.5b481","type":"function","z":"6aced84a.4d4208","name":"gen temperatures","func":"let pl = msg.payload; // list of temperature sensors\nlet out = [];\nlet now = Math.round(Date.now() / 10000);\npl.forEach(function(s, i) {\n    out.push({ location: s, value: 50 + (now/(i+1)) % 40 });\n});\nreturn { payload: out };","outputs":1,"noerr":0,"initialize":"","finalize":"","x":430,"y":820,"wires":[["df1544de.0586b8","368d55fd.22705a","cf96bfad.e7aa6","904a895.f769278"]]},{"id":"df1544de.0586b8","type":"function","z":"6aced84a.4d4208","name":"split","func":"let pl = msg.payload;\nlet msgs = [];\npl.forEach(function(p) {\n    msgs.push({\n        payload: p.value,\n        topic: p.location.replace(/[ -]/g, \"_\"),\n    })\n})\n\nreturn [msgs];","outputs":1,"noerr":0,"initialize":"","finalize":"","x":710,"y":820,"wires":[["ad1e039d.f00c"]]},{"id":"ad1e039d.f00c","type":"link out","z":"6aced84a.4d4208","name":"","links":["db451344.9f853"],"x":855,"y":820,"wires":[]},{"id":"2e243eb9.305d62","type":"tcp in","z":"6aced84a.4d4208","name":"hot-reload","server":"server","host":"","port":"1881","datamode":"stream","datatype":"utf8","newline":"\\n","topic":"","base64":false,"x":120,"y":540,"wires":[["b7e30269.fb1ab","4310a9b6.6ca2a8"]]},{"id":"b7e30269.fb1ab","type":"debug","z":"6aced84a.4d4208","name":"hot reload","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":570,"y":580,"wires":[]},{"id":"4310a9b6.6ca2a8","type":"function","z":"6aced84a.4d4208","name":"match files","func":"let pl = msg.payload;\nif ((new RegExp(/uibuilder.*\\.(js|html|css|vue)$/)).test(pl)) {\n    return { topic: \"hot-reload\", \"cache\": false, payload: null };\n}\nreturn null;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":400,"y":540,"wires":[["ab648ebf.83598","b7e30269.fb1ab"]]},{"id":"ab648ebf.83598","type":"link out","z":"6aced84a.4d4208","name":"","links":["db451344.9f853"],"x":525,"y":540,"wires":[]},{"id":"908402f2.501fd","type":"comment","z":"6aced84a.4d4208","name":"HOT RELOAD: inotifywait -m -r -e moved_to -e close_write -q data/uibuilder | nc localhost 1881","info":"","x":360,"y":500,"wires":[]},{"id":"fd90798c.e43fa8","type":"comment","z":"6aced84a.4d4208","name":"Dashboard test page with cache, access as http://localhost:1880/d/test","info":"","x":290,"y":340,"wires":[]},{"id":"e7610915.0328a8","type":"comment","z":"6aced84a.4d4208","name":"Feed orchard test data","info":"","x":140,"y":660,"wires":[]},{"id":"2fc0466b.32b71a","type":"comment","z":"6aced84a.4d4208","name":"Feed temperature test data","info":"","x":150,"y":780,"wires":[]},{"id":"368d55fd.22705a","type":"function","z":"6aced84a.4d4208","name":"format array","func":"let pl = msg.payload;\nlet out = [];\npl.forEach(function(p) {\n    out.push({\n        title: p.location,\n        value: p.value,\n        unit: \"°F\",\n    })\n})\n\nreturn { topic: \"temp_array\", payload: { \"array\": out } };","outputs":1,"noerr":0,"initialize":"","finalize":"","x":730,"y":860,"wires":[["ad1e039d.f00c"]]},{"id":"cf96bfad.e7aa6","type":"function","z":"6aced84a.4d4208","name":"format array","func":"let pl = msg.payload;\nlet out = [];\npl.forEach(function(p) {\n    out.push({\n        title: p.location,\n        value: p.value,\n        unit: \"°F\",\n    })\n})\n\nreturn { topic: \"gauge_array\", payload: { \"array\": out } };","outputs":1,"noerr":0,"initialize":"","finalize":"","x":730,"y":900,"wires":[["ad1e039d.f00c"]]},{"id":"904a895.f769278","type":"debug","z":"6aced84a.4d4208","name":"gen temps","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":730,"y":940,"wires":[]},{"id":"aaee4dc3.7ca1c","type":"inject","z":"6aced84a.4d4208","name":"orchard state","props":[{"p":"payload"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"{\"manual_valve\":null,\"start_dur\":0,\"start_gal\":63024.8,\"gal_start\":63164.93,\"gallons\":63179.93,\"valves\":[{\"int\":432000,\"src\":0,\"dur\":5400,\"last_gpm\":1.94,\"en\":1,\"last_at\":1619769600},{\"int\":345600,\"src\":0,\"dur\":5400,\"last_gpm\":4.22,\"en\":1,\"last_at\":1619510400},{\"int\":432000,\"src\":0,\"dur\":5400,\"last_gpm\":1.72,\"en\":1,\"last_at\":1619769600},{\"int\":345600,\"src\":0,\"dur\":5400,\"last_gpm\":2.48,\"en\":0,\"last_at\":1611306000},{\"int\":345600,\"src\":0,\"dur\":3600,\"last_gpm\":1.42,\"en\":1,\"last_at\":1619510400},{\"int\":432000,\"src\":0,\"dur\":5400,\"last_gpm\":4.6,\"en\":1,\"last_at\":1619424000},{\"int\":432000,\"src\":0,\"dur\":5400,\"last_gpm\":4.46,\"en\":1,\"last_at\":1619424000},{\"int\":432000,\"src\":0,\"dur\":5400,\"last_gpm\":0.77,\"en\":1,\"last_at\":1619424000}],\"sched_valve\":null,\"at\":1619890115,\"done_today\":false,\"sched_start_min\":780,\"start_at\":0}","payloadType":"json","x":160,"y":700,"wires":[["39f6e7a2.ccfe78"]]}]