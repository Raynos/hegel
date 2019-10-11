// @flow
import { Type } from "./type";
import { TupleType } from "./tuple-type";
import { ObjectType } from "./object-type";
import { getNameForType } from "../../utils/type-utils";
import { createTypeWithName } from "./create-type";
import type { Scope } from "../scope";
import type { TypeVar } from "./type-var";
import type { TypeMeta } from "./type";
import type { CollectionType } from "./collection-type";

const UNDEFINED = new Type("undefined", { isSubtypeOf: new Type("void") });

export class RestArgument extends Type {
  type: Type;

  constructor(type: Type) {
    super(`...${String(type.name)}`);
    this.type = type;
  }

  changeAll(
    sourceTypes: Array<Type>,
    targetTypes: Array<Type>,
    typeScope: Scope
  ) {
    const newType = this.type.changeAll(sourceTypes, targetTypes, typeScope);
    if (this.type === newType) {
      return this;
    }
    return new RestArgument(newType);
  }
}

export class FunctionType extends Type {
  static createTypeWithName = createTypeWithName(FunctionType);

  static getName(
    params: Array<Type | RestArgument>,
    returnType: Type,
    genericParams: Array<TypeVar> = []
  ) {
    const genericPart = genericParams.length
      ? `<${genericParams.reduce(
          (res, t) =>
            `${res}${res ? ", " : ""}${getNameForType(t)}${
              t.constraint ? `: ${getNameForType(t.constraint)}` : ""
            }`,
          ""
        )}>`
      : "";
    const args = params
      .map(param => {
        const isRest = param instanceof RestArgument;
        // $FlowIssue
        const t = getNameForType(isRest ? param.type : param);
        return isRest ? `...${t} ` : t;
      })
      .join(", ");
    return `${genericPart}(${args}) => ${getNameForType(returnType)}`;
  }

  argumentsTypes: Array<Type | RestArgument>;
  returnType: Type;
  throwable: ?Type;

  constructor(
    name: string,
    argumentsTypes: Array<Type | RestArgument>,
    returnType: Type,
    typeMeta: TypeMeta = { isSubtypeOf: new ObjectType("Function", []) }
  ) {
    super(name, typeMeta);
    this.argumentsTypes = argumentsTypes;
    this.returnType = returnType;
  }

  changeAll(
    sourceTypes: Array<Type | RestArgument>,
    targetTypes: Array<Type | RestArgument>,
    typeScope: Scope
  ): Type {
    let isArgumentsChanged = false;
    const newArguments = this.argumentsTypes.map(t => {
      const newT = t.changeAll(sourceTypes, targetTypes, typeScope);
      if (newT === t) {
        return t;
      }
      isArgumentsChanged = true;
      return newT;
    });
    const newReturn = this.returnType.changeAll(
      sourceTypes,
      targetTypes,
      typeScope
    );
    const isSubtypeOf =
      this.isSubtypeOf &&
      this.isSubtypeOf.changeAll(sourceTypes, targetTypes, typeScope);
    if (
      newReturn === this.returnType &&
      isSubtypeOf === this.isSubtypeOf &&
      !isArgumentsChanged
    ) {
      return this;
    }

    return FunctionType.createTypeWithName(
      FunctionType.getName(newArguments, newReturn),
      typeScope,
      newArguments,
      newReturn,
      { isSubtypeOf }
    );
  }

  equalsTo(anotherType: Type) {
    if (this.referenceEqualsTo(anotherType)) {
      return true;
    }
    if (!(anotherType instanceof FunctionType)) {
      return false;
    }
    return (
      super.equalsTo(anotherType) &&
      this.returnType.equalsTo(anotherType.returnType) &&
      this.argumentsTypes.every((arg, i) => {
        // $FlowIssue
        const otherArgument = anotherType.argumentsTypes[i];
        const arg1 = arg instanceof RestArgument ? arg.type : arg;
        const arg2 =
          otherArgument instanceof RestArgument
            ? otherArgument.type
            : otherArgument;
        return arg1.equalsTo(arg2);
      })
    );
  }

  isSuperTypeFor(anotherType: Type): boolean {
    if (!(anotherType instanceof FunctionType)) {
      return false;
    }
    return (
      this.returnType.isPrincipalTypeFor(anotherType.returnType) &&
      this.argumentsTypes.every((arg, i) => {
        // $FlowIssue
        const otherArgument = anotherType.argumentsTypes[i] || UNDEFINED;
        const arg1 = arg instanceof RestArgument ? arg.type : arg;
        const arg2 =
          otherArgument instanceof RestArgument
            ? otherArgument.type
            : otherArgument;
        return arg1.isPrincipalTypeFor(arg2);
      })
    );
  }
}