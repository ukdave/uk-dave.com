---
title: Retriable Calculator
date: 2025-06-13T21:00:00+01:00
description: A calculator for the retriable Ruby gem.
---

This is a calculator for the [retriable](https://github.com/kamui/retriable) Ruby gem. Retriable is a simple DSL to
retry failed code blocks with randomized exponential backoff time intervals. This is especially useful when interacting
external APIs, remote services, or file system calls.

<!--more-->

<div x-data="{ baseInterval: 0.5, multiplier: 1.5, randFactor: 0.5, tries: 10 }">
  <div class="row justify-content-center">
    <div class="col-xxl-7 col-xl-8 col-lg-10 mb-3">
      <div class="card">
        <div class="card-body">
          <form>
            <input type="reset" class="btn btn-primary float-end">
            <div class="input-group mb-3">
              <label class="input-group-text" style="width: 8em;">Base Interval</label>
              <input class="form-control" name="baseInterval" type="number" min="0" step="0.25" value="0.5" x-model="baseInterval">
            </div>
            <div class="input-group mb-3">
              <label class="input-group-text" style="width: 8em;">Multiplier</label>
              <input class="form-control" name="baseInterval" type="number" min="0" step="0.25" value="1.5" x-model="multiplier">
            </div>
            <div class="input-group mb-3">
              <label class="input-group-text" style="width: 8em;">Rand Factor</label>
              <input class="form-control" name="baseInterval" type="number" min="0" step="0.25" value="0.5" x-model="randFactor">
            </div>
            <div class="input-group mb-3">
              <label class="input-group-text" style="width: 8em;">Tries</label>
              <input class="form-control" name="baseInterval" type="number" min="1" value="10" x-model="tries">
            </div>
          </form>
<div id="code">

```ruby
Retriable.retriable(tries: 1, base_interval: 1, multiplier: 1, rand_factor: 1) do
  # code here...
end
```

</div>
          <div class="row justify-content-center">
            <div class="col-md-9">
              <table class="table table-sm table-striped text-end">
                <thead>
                  <tr>
                    <th style="width: 25%">Retry #</th>
                    <th style="width: 25%">Min</th>
                    <th style="width: 25%">Average</th>
                    <th style="width: 25%">Max</th>
                  </tr>
                </thead>
                <tbody class="font-monospace">
                  <template x-for="i in parseInt(tries) - 1" :key="i">
                    <tr>
                      <td x-text="i"></td>
                      <td x-text="(parseFloat(baseInterval) * Math.pow(parseFloat(multiplier), i-1) * (1 - parseFloat(randFactor))).toFixed(3)"></td>
                      <td x-text="(parseFloat(baseInterval) * Math.pow(parseFloat(multiplier), i-1)).toFixed(3)"></td>
                      <td x-text="(parseFloat(baseInterval) * Math.pow(parseFloat(multiplier), i-1) * (1 + parseFloat(randFactor))).toFixed(3)"></td>
                    </tr>
                  </template>
                  <tr>
                    <td x-text="tries"></td>
                    <td>stop</td>
                    <td>stop</td>
                    <td>stop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script>
  const args = document.querySelectorAll("#code .mi");
  if (args.length >= 4) {
    args[0].setAttribute("x-text", "tries");
    args[1].setAttribute("x-text", "baseInterval");
    args[2].setAttribute("x-text", "multiplier");
    args[3].setAttribute("x-text", "randFactor");
  }
</script>
