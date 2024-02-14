(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{187:function(t,s,a){"use strict";a.r(s);var n=a(0),e=Object(n.a)({},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"chapter-1-what-is-functional-programming"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#chapter-1-what-is-functional-programming","aria-hidden":"true"}},[t._v("#")]),t._v(" Chapter 1. What is functional programming?")]),t._v(" "),a("p",[t._v("We construct our programs using only "),a("em",[t._v("pure functions")]),t._v(" - functions that have no "),a("em",[t._v("side effects")]),t._v(".")]),t._v(" "),a("p",[t._v("A function has a side effect if it does anything other than return a value. Examples:")]),t._v(" "),a("ul",[a("li",[t._v("Modifying any state, such as a variable or data structure, in place")]),t._v(" "),a("li",[t._v("Throwing an exception or exiting the program with an error")]),t._v(" "),a("li",[t._v("Reading or writing a file")]),t._v(" "),a("li",[t._v("Making a network request")])]),t._v(" "),a("h2",{attrs:{id:"benefits-of-fp-a-simple-example"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#benefits-of-fp-a-simple-example","aria-hidden":"true"}},[t._v("#")]),t._v(" Benefits of FP: a simple example")]),t._v(" "),a("p",[t._v("We'll walk through refactoring a simple program to remove side effects and demonstrate some TypeScript syntax. We'll\nalso touch on two import concepts in functional programming: "),a("em",[t._v("referential transparency")]),t._v(" and the "),a("em",[t._v("substitution model")]),t._v(".")]),t._v(" "),a("p",[t._v("See "),a("a",{attrs:{href:"https://github.com/calebharris/fp_book_club_ts/tree/master/code/libfpts/intro",target:"_blank",rel:"noopener noreferrer"}},[t._v("the code repository"),a("OutboundLink")],1),t._v(" for expanded,\nrunnable versions of these examples.")]),t._v(" "),a("h3",{attrs:{id:"a-program-with-side-effects"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#a-program-with-side-effects","aria-hidden":"true"}},[t._v("#")]),t._v(" A program with side effects")]),t._v(" "),a("div",{staticClass:"language-typescript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `class` keyword introduces a class")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Cafe")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// method of a class introduced by a")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// name followed by ()")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("buyCoffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Coffee "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("   "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `cc: CreditCard` defines parameter")]),t._v("\n                                        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//  named `cc` of type `CreditCard`")]),t._v("\n                                        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//")]),t._v("\n                                        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `: Coffee` declares the return type")]),t._v("\n                                        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// of the method. compiler will error")]),t._v("\n                                        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// if the method doesn't return a")]),t._v("\n                                        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `Coffee` object")]),t._v("\n\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" cup "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Coffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("charge")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cup"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("price"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("               "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// side effect: charges the card")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" cup"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br"),a("span",{staticClass:"line-number"},[t._v("15")]),a("br"),a("span",{staticClass:"line-number"},[t._v("16")]),a("br"),a("span",{staticClass:"line-number"},[t._v("17")]),a("br"),a("span",{staticClass:"line-number"},[t._v("18")]),a("br")])]),a("p",[t._v("The line "),a("code",[t._v("cc.charge(cup.price)")]),t._v(" is an example of a side effect. Charging a credit card involves some interaction\nwith the outside world. But the function's return value is just a "),a("code",[t._v("Coffee")]),t._v(", meaning this interaction is not easily\nobservable, making our function difficult to test. We can improve modularity and testability by introducing a\n"),a("code",[t._v("Payments")]),t._v(" object that encapsulates the payment processing logic and removing it from "),a("code",[t._v("CreditCard")]),t._v(".")]),t._v(" "),a("h3",{attrs:{id:"adding-a-payments-object"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#adding-a-payments-object","aria-hidden":"true"}},[t._v("#")]),t._v(" Adding a Payments object")]),t._v(" "),a("div",{staticClass:"language-typescript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Cafe")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("buyCoffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" p"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Payments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Coffee "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" cup "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Coffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    p"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("charge")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" cup"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("price"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" cup"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br")])]),a("p",[t._v("The side effect still happens. But we have improved testability because we can pass in a mock "),a("code",[t._v("Payments")]),t._v(" object.\nHowever, any mock will be awkward to use, because it will have to do things like maintain internal state that we can\ninspect after the call to "),a("code",[t._v("charge()")]),t._v(". This is a bit much if all we want is to test that buyCoffee charges the correct\namount for a cup of coffee. It's also going to be tough to reuse buyCoffee. Say we wanted to buy 10 coffees: there is\nno obvious way to do that without contacting the payment processor 10 times!")]),t._v(" "),a("h3",{attrs:{id:"a-functional-solution-removing-the-side-effects"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#a-functional-solution-removing-the-side-effects","aria-hidden":"true"}},[t._v("#")]),t._v(" A functional solution: removing the side effects")]),t._v(" "),a("div",{staticClass:"language-typescript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// buyCoffee now returns a pair, or tuple, of the")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// purchased Coffee  and its associated Charge")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("buyCoffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Coffee"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Charge"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" cup "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Coffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" charge "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Charge")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" cup"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("price"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("cup"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" charge"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br")])]),a("p",[t._v("Here, we've removed the side effect. Instead of immediately interacting with the payment processor, "),a("code",[t._v("buyCoffee")]),t._v(" returns\na new "),a("code",[t._v("Charge")]),t._v(" value object along with the "),a("code",[t._v("Coffee")]),t._v(". We can think of this as a description of what we want to happen,\nrather than detailed instructions on how to accomplish it. Actually "),a("em",[t._v("interpreting")]),t._v(" the meaning of "),a("code",[t._v("Charge")]),t._v(" objects is\nnow a concern for elsewhere. In fact, "),a("code",[t._v("Cafe")]),t._v(" no longer has any knowledge of how the process of charging the card works.\nLet's look at "),a("code",[t._v("Charge")]),t._v(" more closely:")]),t._v(" "),a("div",{staticClass:"language-typescript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Charge")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("readonly")]),t._v(" cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// once a Charge is created, it should never")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("readonly")]),t._v(" amount"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// change, hence the `readonly` markers")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("constructor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" amount"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cc "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("amount "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" amount"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n   * Returns a new Charge containing the sum of the amounts of this Charge\n   * and the other Charge\n   **/")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("combine")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("other"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Charge"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Charge "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cc "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" other"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Charge")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("amount "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" other"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("amount"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("throw")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Error")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Can\'t combine charges to different cards"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br"),a("span",{staticClass:"line-number"},[t._v("15")]),a("br"),a("span",{staticClass:"line-number"},[t._v("16")]),a("br"),a("span",{staticClass:"line-number"},[t._v("17")]),a("br"),a("span",{staticClass:"line-number"},[t._v("18")]),a("br"),a("span",{staticClass:"line-number"},[t._v("19")]),a("br"),a("span",{staticClass:"line-number"},[t._v("20")]),a("br")])]),a("p",[a("code",[t._v("Charge")]),t._v(" is an immutable value object, equipped with a "),a("code",[t._v("combine()")]),t._v(" function to merge two charges into one. Now we have\na way to more easily represent the idea of purchasing 10 coffees. We just need to combine the 10 charges into one.")]),t._v(" "),a("div",{staticClass:"language-typescript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("buyCoffees")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Coffee"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Charge"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" cards"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" CreditCard"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Array")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("fill")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" purchases "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("Array")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cards"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("cc")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("buyCoffee")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// this part is a bit ugly, but we're just splitting the array of")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [Coffee, Charge] tuples into one Coffee array and one Charge array")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("coffs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" chgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" purchases"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("reduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("coffees"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" charges"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("coffee"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" charge"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        coffees"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("coffee"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        charges"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("charge"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("coffees"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" charges"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Array")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Array")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// reduce the list of Charges to one by sequentially applying combine()")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("coffs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" chgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("reduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("l"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" r")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" l"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("combine")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("r"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br"),a("span",{staticClass:"line-number"},[t._v("15")]),a("br"),a("span",{staticClass:"line-number"},[t._v("16")]),a("br"),a("span",{staticClass:"line-number"},[t._v("17")]),a("br"),a("span",{staticClass:"line-number"},[t._v("18")]),a("br")])]),a("p",[t._v("Our functional solution has significant advantages over the previous two iterations. It's easier to test, since all we\nneed to do is assert that the "),a("code",[t._v("Charge")]),t._v(" objects have the expected values in their "),a("code",[t._v("cc")]),t._v(" and "),a("code",[t._v("amount")]),t._v(" properties. It's\nalso easier to combine simple, low-level behavior into more advanced functionality. Look how straightforward it was to\nimplement batch charging! Finally, we can imagine that the library for communicating with the payment processor is made\nsimpler by this approach. It only needs to issue the correct commands for any given value of "),a("code",[t._v("Charge")]),t._v(".")]),t._v(" "),a("div",{staticClass:"tip custom-block"},[a("p",{staticClass:"custom-block-title"},[t._v("Note")]),t._v(" "),a("p",[t._v("If you've been following along in "),a("em",[t._v("Functional Programming in Scala")]),t._v(", you may have noticed that the Scala code\ncorresponding to these snippets is more compact and elegant. For instance, TypeScript doesn't have the notion of\n"),a("code",[t._v("case")]),t._v(" classes, requiring us to write a little more boilerplate to achieve the same end. It also lacks an "),a("code",[t._v("unzip")]),t._v("\nfor easily separating a sequence of tuples into a tuple of sequences. In general, TypeScript's standard library (which\nis really just JavaScript's) is less comprehensive than Scala's.")]),t._v(" "),a("p",[t._v("On the other hand, TypeScript has better destructuring support (e.g. "),a("code",[t._v("const [coffees, charges] = ...")]),t._v(") and is a\nrelatively thin enhancement to JavaScript, giving it great applicability to web programming. Many people find the\nexperience of developing software with Node.js to be a joy (and, conversely, developing with anything JVM-based to be a\nconstant time-suck).")]),t._v(" "),a("p",[t._v("Later on, we'll have to employ some advanced, potentially difficult-to-understand techniques to get the same expressive\npower from TypeScript's types as we can with Scala's. Still, TypeScript is a powerful, easy-to-deploy, and\nrapidly-evolving language that drastically improves our ability to manage and maintain large JavaScript projects.")])]),t._v(" "),a("h2",{attrs:{id:"definition-of-a-pure-function"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#definition-of-a-pure-function","aria-hidden":"true"}},[t._v("#")]),t._v(" Definition of a pure function")]),t._v(" "),a("p",[t._v('The book differentiates between "functions" and "procedures", stating that the phrase "pure function" is redundant. But\ngiven the preponderance of using "function" to mean any semi-cohesive, addressable sequence of code, we\'ll stick with\nexplicitly calling functions "pure" when it matters. Consider a function '),a("code",[t._v("f")]),t._v(", with an input type of "),a("code",[t._v("A")]),t._v(" and an output\ntype of "),a("code",[t._v("B")]),t._v(". In both Scala and TypeScript, the type of "),a("code",[t._v("f")]),t._v(" is written as "),a("code",[t._v("A => B")]),t._v(". Then "),a("code",[t._v("f")]),t._v(" is pure if it relates every\nvalue of "),a("code",[t._v("A")]),t._v(" to exactly one value of "),a("code",[t._v("B")]),t._v(", the output value is determined solely by the input value, and "),a("code",[t._v("f")]),t._v(" takes no\nother actions that change the meaning of the program.")]),t._v(" "),a("p",[t._v("Some examples of pure functions:")]),t._v(" "),a("ul",[a("li",[t._v("Integer addition")]),t._v(" "),a("li",[t._v("Index of substring in string, if the string is immutable")])]),t._v(" "),a("p",[t._v("The concept of "),a("em",[t._v("referential transparency")]),t._v(", which is a property of "),a("em",[t._v("expressions")]),t._v(", formalizes purity. Any part of a\nprogram that can be evaluated to a result is an expression (meaning that a function is one kind of expression), and it\nis referentially transparent (or RT) if its every occurence in a program can be replaced by its result without altering\nthe meaning of the program. More formally:")]),t._v(" "),a("div",{staticClass:"tip custom-block"},[a("p",{staticClass:"custom-block-title"},[t._v("Referential transparency and purity")]),t._v(" "),a("p",[t._v("An expression "),a("code",[t._v("e")]),t._v(" is "),a("em",[t._v("referentially transparent")]),t._v(" if, for all programs "),a("code",[t._v("p")]),t._v(", all occurrences of "),a("code",[t._v("e")]),t._v(" in "),a("code",[t._v("p")]),t._v(" can be\nreplaced by the result of evaluating "),a("code",[t._v("e")]),t._v(" without changing the meaning of "),a("code",[t._v("p")]),t._v(". A function "),a("code",[t._v("f")]),t._v(" is "),a("em",[t._v("pure")]),t._v(" if the\nexpression "),a("code",[t._v("f(x)")]),t._v(" is referentially transparent for all referentially transparent "),a("code",[t._v("x")]),t._v(".")])]),t._v(" "),a("p",[t._v("Referential transparency allows us to reason about programs using the substitution model, wherein we discover the\nmeaning of program by repeatedly replacing expressions with their results.")])])},[],!1,null,null,null);s.default=e.exports}}]);