---
title: "x86-64 Assembly"
date: 2023-11-15T21:00:00+00:00
---

# Introduction

x86-64 assembly is the programming language for the 64-bit version of the x86 instruction set. It is based on the
original 8086 instruction set from 1978.

This post is intended as a sort of cheat-sheet, assembled while working through the
[x86-64 Assembly](https://exercism.org/tracks/x86-64-assembly) track on [Exercism](https://exercism.org).


# Registers

There are 16 general purpose registers, each of which can be addressed in full, or by the lower 32, 16, and 8 bits:

<div class="row justify-content-center">
  <div class="col-xl-10 col-lg-12">

| 64-bit | 32-bit | 16-bit | 8-bit      | Special Purpose for functions | When calling a function | When writing a function |
| ------ | ------ | ------ | ---------- | ----------------------------- | ----------------------- | ----------------------- |
| `rax`  | `eax`  | `ax`   | `ah`, `al` | Return Value                  | Might be changed        | Use freely              |
| `rbx`  | `ebx`  | `bx`   | `bh`, `bl` |                               | Will not be changed     | Save before using!      |
| `rcx`  | `ecx`  | `cx`   | `ch`, `cl` | 4th integer argument          | Might be changed        | Use freely              |
| `rdx`  | `edx`  | `dx`   | `dh`, `dl` | 3rd integer argument          | Might be changed        | Use freely              |
| `rsi`  | `esi`  | `si`   | `sil`      | 2nd integer argument          | Might be changed        | Use freely              |
| `rdi`  | `edi`  | `di`   | `sil`      | 1st integer argument          | Might be changed        | Use freely              |
| `rbp`  | `ebp`  | `bp`   | `bpl`      | Frame Pointer                 | Maybe Be Careful        | Maybe Be Careful        |
| `rsp`  | `esp`  | `sp`   | `spl`      | Stack Pointer                 | Be Very Careful!        | Be Very Careful!        |
| `r8`   | `r8d`  | `r8w`  | `r8b`      | 5th integer argument          | Might be changed        | Use freely              |
| `r9`   | `r9d`  | `r9w`  | `r9b`      | 6th integer argument          | Might be changed        | Use freely              |
| `r10`  | `r10d` | `r10w` | `r10b`     |                               | Might be changed        | Use freely              |
| `r11`  | `r11d` | `r11w` | `r11b`     |                               | Might be changed        | Use freely              |
| `r12`  | `r12d` | `r12w` | `r12b`     |                               | Will not be changed     | Save before using!      |
| `r13`  | `r13d` | `r13w` | `r13b`     |                               | Will not be changed     | Save before using!      |
| `r14`  | `r14d` | `r14w` | `r14b`     |                               | Will not be changed     | Save before using!      |
| `r15`  | `r15d` | `r15w` | `r15b`     |                               | Will not be changed     | Save before using!      |
{.table}

https://math.hws.edu/eck/cs220/f22/registers.html
{.blockquote-footer}

```{.text-center}
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ rax ━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                               ┏━━━━━━━━━━━━━ eax ━━━━━━━━━━━━┫
┃                               ┃               ┏━━━━━ ax ━━━━━┫
┃                               ┃               ┣━━ ah ━┳━ al ━┫
0000000000000000000000000000000000000000000000000000000000000000
```

https://www.jamieweb.net/info/x86_64-general-purpose-registers-reference/
{.blockquote-footer}

  </div>
</div>

Usage during syscall/function call:

*  First six arguments are in `rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9`; remaining arguments are on the stack.
*  For syscalls, the syscall number is in `rax`. For procedure calls, `rax` should be set to 0.
*  Return value is in `rax`.
*  The called routine is expected to preserve `rsp`, `rbp`, `rbx`, `r12`, `r13`, `r14`, and `r15` but may trample any other registers.


# Instructions

## Data Transfer

```nasm
mov  rax, 0x000F     ; Store the value 15 into the rax register
mov  rdi, rsi        ; Copy the value in the rsi register into the rdi register

lea  rdi, [message]  ; Load the address of [message] into the rdi register

push rcx             ; Push the value in the rcx register onto the top of the stack

pop  rcx             ; Pop the value off the top of the stack and into the rcx register
```


## Arithmetic

```nasm
add  rdi, rsi        ; Add the value in rsi to rdi, and store the result in rdi
                     ; (i.e. rdi = rdi + rsi)

sub  rdi, rsi        ; Subtract the value in rsi from rdi, and store the result in rdi
                     ; (i.e. rdi = rdi - rsi)

inc  rax             ; Increment the value in rax by 1
                     ; (i.e. rax = rax + 1)

dec  rax             ; Decrement the value in rax by 1
                     ; (i.e. rax = rax - 1)
```


## Binary

```nasm
and  rdi, rsi        ; Bitwise AND, store result in rdi
                     ; (i.e. rdi = rdi & rsi)

or   rdi, rsi        ; Bitwise OR, store result in rdi
                     ; (i.e. rdi = rdi | rsi)

xor  rdi, rsi        ; Bitwise XOR, store result in rdi
                     ; (i.e. rdi = rdi ^ rsi)

not  rax             ; Bitwise Logical Not

shl  rax, 1          ; Shift left the bits in rax, padding the resulting empty bit positions with zeros

shr  rax, 1          ; Shift right the bits in rax, padding the resulting empty bit positions with zeros
```


## Comparison

```nasm
cmp  rdi, rsi       ; Compare rdi and rsi (rdi - rsi) and set flags.
                    ; Similar to sub, but result is discarded.

test rdi, rsi       ; Compare rdi and rsi (rdi & rsi) and set flags.
                    ; Similar to and, but result is discarded.
```


## Jump

<div class="row justify-content-center">
  <div class="col-xl-10 col-lg-12">

| Instruction | Synonym | Description                          |
| ----------- | ------- | ------------------------------------ |
| `jmp`       |         | Unconditional                        |
| `je`        | `jz`    | Equal / zero                         |
| `jne`       | `jnz`   | Not equal / not zero                 |
| `js`        |         | Negative                             |
| `jns`       |         | Non-negative                         |
| `jg`        | `jnle`  | Greater than (signed >)              |
| `jge`       | `jnl`   | Greater than or equal to (signed >=) |
| `jl`        | `jnge`  | Less then (signed <)                 |
| `jle`       | `jng`   | Less then or equal to (signed <=)    |
| `ja`        | `jnbe`  | Above (unsigned >)                   |
| `jae`       | `jnb`   | Above or equal (unsigned >=)         |
| `jb`        | `jnae`  | Below (unsigned <)                   |
| `jbe`       | `jna`   | Below or equal (unsigned <=)         |
{.table}

  </div>
</div>

For all jump instructions other than `jmp` (which is unconditional), some previous instruction (`cmp`, `test`, etc.)
is needed to set the condition codes to be examined by the jump.

```nasm
cmp  rdi, rsi        ; Compare rdi and rsi
je   .label          ; Jump to .label if equal
```


## Procedure calls

```nasm
call  label            ; Push return address and jump to label

ret                    ; Pop return address from stack and jump there
```


# System Calls

Assembly programs can interact with the operating system using system calls:

1. Put the system call number into `rax`
2. Load any arguments into the corresponding registers (`rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9`)
3. Call `syscall`

System call numbers differ for Linux and macOS:

* Linux: https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_64.tbl

* macOS: https://github.com/opensource-apple/xnu/blob/master/bsd/kern/syscalls.master \
  Note you need to add 0x2000000 to the call number.

```nasm
; ----------------------------------------------------------------------------------------
; Writes "Hello, World" to the console using only system calls. Runs on 64-bit macOS only.
; To assemble and run:
;
;     nasm -fmacho64 hello.asm
;     ld hello.o -static -o hello
;     ./hello
; ----------------------------------------------------------------------------------------

          global    start

          section   .text
start:    mov       rax, 0x02000004         ; system call for write
          mov       rdi, 1                  ; file handle 1 is stdout
          mov       rsi, message            ; address of string to output
          mov       rdx, 13                 ; number of bytes
          syscall                           ; invoke operating system to do the write

          mov       rax, 0x02000001         ; system call for exit
          mov       rdi, 0                  ; exit code 0
          syscall                           ; invoke operating system to exit


          section   .data
message:  db        "Hello, World", 10      ; note the newline at the end
```

# Using C libraries

```nasm
; ----------------------------------------------------------------------------------------
; Prints the numbers 1-10 using the C library printf function. Runs on 64-bit macOS only.
; To assemble and run:
;
;     nasm -fmacho64 numbers.asm
;     ld -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -lc -o numbers numbers.o
;     ./numbers
; ----------------------------------------------------------------------------------------

          global    _main
          extern    _printf
          default   rel


          section   .text
_main:
          mov       rcx, 1                  ; initialise the counter to 1

print_loop:
          ; Print the counter
          push      rcx                     ; caller - save register
          lea       rdi, [format]           ; set 1st parameter (format)
          mov       rsi, rcx                ; set 2nd parameter (current number)
          call      _printf                 ; call the C library printf function
          pop       rcx                     ; restore caller-saved register

          ; Increment the counter and loop while <= 10
          inc       rcx                     ; increment the counter
          cmp       rcx, 10                 ; compare the counter value to 10
          jle       print_loop              ; jump to print_loop if less then or equal to

          ; Exit the program
          mov       rax, 0                  ; set the exit code
          ret


          section   .data
format:   db        "%d", 10, 0             ; note the newline and NULL characters at the end
```

The above is equivalent to this in C:

```c
#include <stdio.h>

int main() {
  int i;
  for (i = 1; i <= 10; i++) {
    printf("%d\n", i);
  }
  return 0;
}
```

or this in Ruby:

```ruby
(1..10).each {|n| puts n }
```

# Resources

* [NASM Tutorial](https://cs.lmu.edu/~ray/notes/nasmtutorial/)
* [BEYOND HELLO WORLD - The Daft Guide to 64-bit Assembly for macOS by Virgil Grimes](http://daft.getforge.io/)
