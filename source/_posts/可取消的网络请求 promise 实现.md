---
title: 可以取消的网络请求 promise 实现
date: 2025-03-04 10:36:23
tags: 编程技巧
---



在某些时候，比如进入软件 viewers 选中一个 病人的序列，但是想看另一个序列，此时首先选中的序列已经在加载中，而想看的序列却被排序在后面才能被加载，这时候我们需要一个可取消的网络请求 promise 实现。

```js
function loadImage(imageId) {
    // Parse the imageId and return a usable URL (logic omitted)
    const url = parseImageId(imageId);
    
    let oReq = new XMLHttpRequest(); // Store the request so we can abort it later

    // Create a new Promise
    const promise = new Promise((resolve, reject) => {
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onreadystatechange = function() {
            if (oReq.readyState === 4) {
                if (oReq.status === 200) {
                    // Request succeeded, Create an image object (logic omitted)
                    const image = createImageObject(oReq.response);
                    resolve(image);
                } else {
                    // Handle error scenarios
                    reject(new Error(oReq.statusText));
                }
            }
        };

        oReq.onerror = function() {
            reject(new Error("Network Error"));
        };

        oReq.onabort = function() {
            reject(new Error("Request Aborted"));
        };

        oReq.send();
    });

    // Define the cancel function to abort the request
    const cancelFn = () => {
        if (oReq) {
            oReq.abort(); // Cancel the request
        }
    };

    // Return both the promise and the cancel function
    return { promise, cancelFn };
}

```

简而言之就是利用 XMLHttpRequest 请求的 onabort 方法，通过 cancelFn 调用，在需要的时候执行 cancelFn