---
title: Rake Announcer Gem
date: 2025-02-12
description: "Small Ruby gem that prints friendly, colourful announcements before selected Rake tasks and provides a celebratory 'All Tests Passed' message."
tags:
  - ruby
---

[RakeAnnouncer](https://github.com/ukdave/rake_announcer) is a tiny, dependency-light Ruby gem that improves the developer experience by printing short colourful announcements before selected Rake tasks run. It's useful in CI logs, local development runs, and any place where visibly separating task output makes the build output easier to scan.

It was inspired by the [Rake-n-Bake](https://github.com/RichardVickerstaff/rake-n-bake) gem which is a collection of widely applicable Rake tasks, but hasn't been maintained since 2019. Most of the Rake tasks I use (rubocop, rspec, etc) include their own Rake tasks, so I don't have much use for those provided by Rake-n-Bake, but I did like its `log_step` method and `ok_rainbow` task.

{{< figure
  src="https://github.com/ukdave/rake_announcer/raw/main/screenshot.png?raw=true"
  alt="Screenshot of RakeAnnouncer in action"
  caption="Screenshot of RakeAnnouncer in action"
>}}

# Installation and usage

Add the gem to your application's Gemfile by running:

```bash
bundle add rake_announcer
```

and then add this to your `Rakefile`:

```ruby
require "rake_announcer/rake_task"
RakeAnnouncer::RakeTask.new(tasks: %i[spec rubocop])
```

Include the names of any rake tasks that you want announced in the `tasks` array. The above example will print a message before the `spec` and `rubocop` tasks run.

If you have a default Rake task defined you can automatically announce all of the dependent tasks like so avoiding any duplication:

```ruby
task default: %i[spec rubocop]

require "rake_announcer/rake_task"
RakeAnnouncer::RakeTask.new(tasks: Rake::Task[:default].prereqs, prepend: true)
```

By default announcements are displayed immediately before each task runs, but after the task's dependencies/prerequisites have run. If you prefer the announcement to be displayed before any of the task's dependencies/prerequisites have run then you can use the `prepend: true` option.

Finally, you can print a simple "All Tests Passed" message by adding the `rake_announcer:ok` task, e.g.:

```ruby
task default: %i[spec rubocop rake_announcer:ok]
```

# How it works

RakeAnnouncer exposes three small functions:

- `RakeAnnouncer.announce_rake_task(task_name, prepend: false)` \
  Creates an internal announce task named `announce_<task_name>` and either prepends it to the specified task's prerequisites (when `prepend: true`) or enhances the specified task so the announce task runs first (`prepend: false` - the default behaviour).

- `RakeAnnouncer.announce(message)` \
  Prints the given message to the STDOUT in blue, underlined, and prefixed with a bullet.

- `RakeAnnouncer.ok(message = "ALL TESTS PASSED")` \
  Prints a colourful, bold banner to STDOUT. Useful as a final confirmation in `rake` runs.

# Installation

Add the gem to your application's Gemfile by executing:

```bash
bundle add rake_announcer
```

Add this to your `Rakefile`:

```ruby
require "rake_announcer/rake_task"
RakeAnnouncer::RakeTask.new(tasks: %i[spec rubocop])
```

The `tasks:` array should contain the names of the rake tasks you want announced. In this example, `spec` and `rubocop` will be preceded by a short, underlined, blue announcement like "● Running spec".

By default announcements are displayed immediately before the task runs, but after the task's dependencies/prerequisites have run. If you prefer the announcement to be displayed before any of the task's dependencies/prerequisites have run then pass `prepend: true`:

```ruby
RakeAnnouncer::RakeTask.new(tasks: %i[spec rubocop], prepend: true)
```

# Example Rakefile for a Gem

Below is an example Rakefile for a simple gem that only has a couple of tasks - rubocop and rspec.

```ruby
require "rspec/core/rake_task"
RSpec::Core::RakeTask.new(:spec)

require "rubocop/rake_task"
RuboCop::RakeTask.new

require "rake_announcer/rake_task"
RakeAnnouncer::RakeTask.new(tasks: %i[spec rubocop])

task default: %i[spec rubocop rake_announcer:ok]
```

# Example Rakefile for a Rails app

In a Rails project, you may have multiple tasks that run by default. To announce all of these tasks without repeating their names, you can pass `Rake::Task[:default].prereqs` as the task list. We also set `prepend: true` here, since tasks like rspec may trigger prerequisite tasks that install dependencies or precompile assets.

```ruby
require_relative "config/application"

Rails.application.load_tasks

require "rake_announcer/rake_task"
RakeAnnouncer::RakeTask.new(tasks: Rake::Task[:default].prereqs, prepend: true)
```

# Contributing & License

Bug reports and pull requests are welcome on GitHub: https://github.com/ukdave/rake_announcer. The gem is released under the MIT license.
