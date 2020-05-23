(this.webpackJsonp=this.webpackJsonp||[]).push([[22],{1336:function(e,n,t){"use strict";t.r(n),t.d(n,"_frontmatter",(function(){return o})),t.d(n,"default",(function(){return p}));t(17),t(4),t(3),t(1),t(12),t(11),t(22);var r=t(58),a=t(65),i=t(441);t(37);function s(){return(s=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}var o={};void 0!==o&&o&&o===Object(o)&&Object.isExtensible(o)&&!o.hasOwnProperty("__filemeta")&&Object.defineProperty(o,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/docs/docs/type-compatibility.mdx"}});var c={_frontmatter:o},b=a.a;function p(e){var n=e.components,t=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,["components"]);return Object(r.b)(b,s({},c,t,{components:n,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"type-compatibility"},"Type Compatibility"),Object(r.b)("hr",null),Object(r.b)("p",null,"The Hegel tries to implement type safety in JavaScript via strong type system. It means that analyzer ensure that variable value is always assignable to declarated (or inferenced) static type."),Object(r.b)("h2",{id:"which-type-is-assignable-to-another"},"Which type is assignable to another?"),Object(r.b)("p",null,"Next hierarchy is presented in Hegel."),Object(r.b)(i.a,{type:"hierarchy",mdxType:"Schema"}),Object(r.b)("p",null,'This hierachy defines rules of subtyping: "Every type which is higher in the hierarchy will be a super type for current type". Lets discover that by examples.'),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),'// Tuple Type\nconst tuple: [number, number] = [42, 24]; // 👌!\n\n// This is also an Array\nconst array: Array<number> = [42, 24];    // 👌!\n\n// This is also an Object\nconst object: Object = [42, 24];          // 👌!\n\n// This is also "unknown"\nconst unknown: unknown = [42, 24];        // 👌!\n')),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),'// But not in reverse order \n// Object is not a Tuple\n// Error: Type "Object" is incompatible with type "[number, number]"\nconst tuple: [number, number] = new Object();\n\n// And object is not a Array\n// Error: Type "Object" is incompatible with type "Array<number>"\nconst array: Array<number> = new Object();\n\n// But object is Object\nconst object: Object = new Object();\n\n// And object is unknown\nconst unknown: unknown = new Object();\n')),Object(r.b)("h2",{id:"function-types-compatibility"},"Function types Compatibility"),Object(r.b)("p",null,"Functions does not create any hierarhy. Compatibility of two functions defined by the rule:\nyou can assign function to another only if actual arguments types are wider then declared and return type is more specific then declared. This rule sounds like: function is ",Object(r.b)("a",s({parentName:"p"},{href:"https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)"}),"contravariant")," by arguments and ",Object(r.b)("a",s({parentName:"p"},{href:"https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)"}),"covariant")," by return."),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),'let func: (number) => number = () => 42; \n\nfunc = (a: number): number => a;           // 👌!\n\n// It\'s okay because "number | string" is wider than "number"\nfunc = (a: number | string): number => 44; // 👌!\n\n// It\'s okay because "42" is more specific than "number"\nfunc = (a: number): 42 => 42;              // 👌!\n\n// Error: Type "(42) => number" is incompatible with type "(number) => number"\n// Because "42" is more specific than "number"\nfunc = (a: 42): number => 42; \n\n// Error: Type "(number) => number | string" is incompatible with type "(number) => number"\n// Because "number | string" is wider than "number"\nfunc = (a: number): number | string => 42; \n')),Object(r.b)("h2",{id:"generics-compatibility"},"Generics Compatibility"),Object(r.b)("p",null,"Two generic may be contained in hierarchy of each other only if their actual type parameter is in heierarchy of each other. For example, imagine generic container class:"),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),"class Container<T> {\n  value: T;\n\n  constructor(value) {\n      this.value = value;\n  }\n}\n")),Object(r.b)("p",null,"We can see a the same subtyping behavior as with primitive types:"),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),'const wrapped42: Container<42> = new Container<42>(42);         // 👌!\nconst wrappedNumber: Container<number> = new Container<42>(42); // 👌!\n\n// Error: Type "Container<number>" is incompatible with type "Container<42>"\nconst wrappedNumber42: Container<42> = new Container<number>(84);\n\n// Error: Type "Container<number>" is incompatible with type "Container<\'Hello, World\'>"\nconst wrappedHelloWorld: Container<"Hello, World"> = new Container<number>(42);\n')),Object(r.b)("p",null,"It's because ",Object(r.b)("inlineCode",{parentName:"p"},"Container")," type parameters are contained in hierarchy of each other."),Object(r.b)("p",null,"But, as you can see, only literals were used for examples. It's because every subtype of Object in JavaScript act not like a value but like a \"pointer\" at value. So, for all reference types you can't do assign between variables if variables are not the same type."),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),'const wrapped42: Container<42> = new Container<42>(42); // 👌!\n\n// Error: Type "Container<42>" is incompatible with type "Container<number>"\nconst wrappedNumber: Container<number> = wrapped42;\n')),Object(r.b)("h2",{id:"soundness"},"Soundness"),Object(r.b)("p",null,"Soundness is an ability of system to guarantee that after analysis your program will not be in invalid state. "),Object(r.b)("p",null,"Hegel tries to implement the same soundness type system as ",Object(r.b)("a",s({parentName:"p"},{href:"https://reasonml.github.io/"}),"ReasonML/OCaml"),", ",Object(r.b)("a",s({parentName:"p"},{href:"https://www.haskell.org/"}),"Haskell"),", ",Object(r.b)("a",s({parentName:"p"},{href:"https://elm-lang.org/"}),"Elm")," and other ML\n-based languages. It means Hegel tries to catch every single error that might happen at runtime without runtime type checking."),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"If you familiar with ",Object(r.b)("a",s({parentName:"p"},{href:"https://www.rust-lang.org/"}),"Rust Language")," you may know that Rust doesn't provide any type information in runtime and all types will be stripped after type checking, but Rust program is still type safe. It's our dream to implement the same type checking in JavaScript.")),Object(r.b)("h2",{id:"hegel-issue"},"Hegel Issue"),Object(r.b)("p",null,'Also, Hegel as other tools has hack for ignoring any kind of errors. You can pass the "@hegel-issue" comment and error will be ignored.'),Object(r.b)("pre",null,Object(r.b)("code",s({parentName:"pre"},{className:"language-typescript"}),"// @hegel-issue\nconst a: string = 44;\n")),Object(r.b)("p",null,'But, it\'s NOT RECOMMENDED to use it for a quick fix or business task solution. "@hegel-issue" should be used only if the error is Hegel bug.'))}void 0!==p&&p&&p===Object(p)&&Object.isExtensible(p)&&!p.hasOwnProperty("__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/docs/docs/type-compatibility.mdx"}}),p.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-docs-docs-type-compatibility-mdx-ac1b2eb18930ed83550a.js.map