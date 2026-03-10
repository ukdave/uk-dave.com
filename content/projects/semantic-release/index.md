---
title: Semantic Release Gem
date: 2025-02-10T21:00:00+00:00
description: "Ruby gem that makes semantic versioning and releases painless by bumping version numbers, updating changelogs, tagging git and more."
tags:
  - ruby
---

[SemanticRelease](https://github.com/ukdave/semantic_release) is a small Ruby gem that helps you manage the version number of a Ruby application or library using [semantic versioning](https://semver.org/).

Rather than manually editing `lib/version.rb`, updating `CHANGELOG.md`, and remembering which git commands to run, the gem provides a simple set of Rake tasks that bump the major, minor or patch number, persist the new value to disk, and then update a handful of common artefacts before creating a git commit and an annotated tag.

It was inspired by projects such as [SemVer2](https://github.com/haf/semver), [Rake‑n‑Bake](https://github.com/RichardVickerstaff/rake-n-bake) and [Version Manager](https://github.com/tpbowden/version_manager), which appear to be unmaintained. It has no runtime dependencies and is intended to be dropped straight into your own gem or app.

{{< center-block >}}
  {{< figure
    src="https://github.com/ukdave/semantic_release/raw/main/screenshot.png?raw=true"
    alt="Screenshot of SemanticRelease in action"
    caption="Screenshot of SemanticRelease in action"
  >}}
{{< /center-block >}}

# Installation and usage

Add the gem to your application's Gemfile by running:

```bash
bundle add semantic_release
```

Then add the Rake task to your build by requiring in a Rakefile or `lib/tasks/*.rake` file:

```ruby
require "semantic_release/rake_task"
SemanticRelease::RakeTask.new
```

The default task name is `release`, but this can be customised by providing an alternative name to `RakeTask.new`. There are also couple of configuration options that can be set. The `disable_rubygems_message` is useful if you developing a gem that will not be published to rubygems.org.

```ruby
require "semantic_release/rake_task"
SemanticRelease::RakeTask.new(:semver) do |config|
  config.semver_file = "semver.json"
  config.disable_rubygems_message = true
end
```

Once the Rake task is available you can bump the appropriate part of the version with one of the provided tasks:

```bash
rake release:init     # create the .semver file with 0.0.0
rake release:current  # print the current version
rake release:major    # increment the major version and run the release workflow
rake release:minor    # increment the minor version and run the release workflow
rake release:patch    # increment the patch version and run the release workflow
```

The tasks all work by manipulating a small JSON file (by default `.semver`) that contains the `major`, `minor` and `patch` numbers; `release:init` will refuse to run if the file already exists. You can also access the version programmatically via

```ruby
SemanticRelease.current_version   # => "1.2.3"
```

# How it works

Behind the scenes the gem exposes a `SemanticRelease::Semver` class which implements basic operations for a semantic version number including comparison, increment, string and hash conversion, and saving and loading from disk.

A set of updater classes live under `SemanticRelease::Updaters` each of which take care of updating a particular artefact during the release process:

* **Changelog** – prepends a heading to either `CHANGELOG.md` or `history.rdoc` (whichever exists) containing the new version and the current date, and then runs `git add` on the file.
* **VersionRb** – locates a single `version.rb` file somewhere under `lib/` and replaces the `VERSION = "x.y.z"` line with the new value, and then `git add` it.
* **GemfileLock** – if a `*.gemspec` file is present and `Gemfile.lock` is not ignored by git, runs `bundle check` and `git add` on the lockfile so that it contains the newly bumped version.
* **GitTag** – commits the `.semver` file and any other updated files (e.g `CHANGELOG.md` and `lib/version.rb`) with an appropriate message, creates an annotated git tag (e.g. `v1.2.3`), and prints instructions for pushing the branch and (optionally) releasing to RubyGems.

# Example Rakefile

Below is a minimal example that shows how the task is typically wired up.

```ruby
require "rspec/core/rake_task"
RSpec::Core::RakeTask.new(:spec)

require "rubocop/rake_task"
RuboCop::RakeTask.new

require "semantic_release/rake_task"
SemanticRelease::RakeTask.new

# run tests and lint before tagging the release
task default: %i[spec rubocop]
```

# Contributing & License

Bug reports and pull requests are welcome on GitHub: https://github.com/ukdave/semantic_release. The gem is released under the MIT license.
