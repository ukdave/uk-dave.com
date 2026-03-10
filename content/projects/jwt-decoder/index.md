---
title: JWT Decoder
date: 2026-02-17T21:00:00+00:00
description: A decoder for JSON Web Tokens (JWT).
---

A JSON Web Token (JWT) is a compact string used to securely pass information between systems, commonly for login sessions and API authentication. A JWT has three parts separated by dots: a __header__ (which describes the algorithm), a __payload__ (which contains claims like user ID or expiry time), and a __signature__ (which proves the token hasn't been altered). Each part is encoded using __Base64URL__ (a URL-safe version of Base64 that replaces `+` with `-` and `/` with `_`).

<!--more-->

⚠️ __Security notice__: Be careful where you paste or share JWTs — they can contain sensitive information and act as keys to systems or data. This tool processes everything locally in your browser — no data is stored, logged, or sent to any server.

<div class="row" x-data="{token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBCbG9nZ3MiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzcxMzYyMDAwfQ.z5rDdQlzWU96CrLYr31gr2DS_jKn-1XoMSh-Ecj_lpI'}">
  <div class="col-6">
    <h2>Token</h2>
    <textarea class="form-control" rows="5" x-model="token"></textarea>
  </div>
  <div class="col-6">
    <h2>Header</h2>
    <pre class="border" x-html="highlight(pretty(decode(token)[0]))"></code></pre>
    <h2>Payload</h2>
    <pre class="border" x-html="highlight(pretty(decode(token)[1]))"></code></pre>
    <h2>Signature</h2>
    <pre class="border" x-text="decode(token)[2]"></pre>
  </div>
</div>

<link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism-okaidia.min.css" rel="stylesheet">
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-json.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script>
  function decode(t) {
    const parts = t.split(".");
    return parts.length === 3 ? parts.map(decodeBase64Url) : ["", "", ""];
  }
  function decodeBase64Url(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) { str += '='; }
    try {
      return atob(str);
    } catch (e) {
      return "Error: " + e;
    }
  }
  function pretty(s) {
    try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; }
  }
  function highlight(s) {
    return window.Prism ? Prism.highlight(s, Prism.languages.json, "json") : s;
  }
</script>
