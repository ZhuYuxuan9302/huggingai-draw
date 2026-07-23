
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model NewApiUser
 * 
 */
export type NewApiUser = $Result.DefaultSelection<Prisma.$NewApiUserPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more NewApiUsers
 * const newApiUsers = await prisma.newApiUser.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more NewApiUsers
   * const newApiUsers = await prisma.newApiUser.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.newApiUser`: Exposes CRUD operations for the **NewApiUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewApiUsers
    * const newApiUsers = await prisma.newApiUser.findMany()
    * ```
    */
  get newApiUser(): Prisma.NewApiUserDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    NewApiUser: 'NewApiUser'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "newApiUser"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      NewApiUser: {
        payload: Prisma.$NewApiUserPayload<ExtArgs>
        fields: Prisma.NewApiUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewApiUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewApiUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>
          }
          findFirst: {
            args: Prisma.NewApiUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewApiUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>
          }
          findMany: {
            args: Prisma.NewApiUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>[]
          }
          create: {
            args: Prisma.NewApiUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>
          }
          createMany: {
            args: Prisma.NewApiUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewApiUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>[]
          }
          delete: {
            args: Prisma.NewApiUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>
          }
          update: {
            args: Prisma.NewApiUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>
          }
          deleteMany: {
            args: Prisma.NewApiUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewApiUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewApiUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewApiUserPayload>
          }
          aggregate: {
            args: Prisma.NewApiUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewApiUser>
          }
          groupBy: {
            args: Prisma.NewApiUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewApiUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewApiUserCountArgs<ExtArgs>
            result: $Utils.Optional<NewApiUserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model NewApiUser
   */

  export type AggregateNewApiUser = {
    _count: NewApiUserCountAggregateOutputType | null
    _avg: NewApiUserAvgAggregateOutputType | null
    _sum: NewApiUserSumAggregateOutputType | null
    _min: NewApiUserMinAggregateOutputType | null
    _max: NewApiUserMaxAggregateOutputType | null
  }

  export type NewApiUserAvgAggregateOutputType = {
    id: number | null
    quota: number | null
    usedQuota: number | null
    status: number | null
  }

  export type NewApiUserSumAggregateOutputType = {
    id: number | null
    quota: bigint | null
    usedQuota: bigint | null
    status: number | null
  }

  export type NewApiUserMinAggregateOutputType = {
    id: number | null
    oidcId: string | null
    username: string | null
    quota: bigint | null
    usedQuota: bigint | null
    status: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NewApiUserMaxAggregateOutputType = {
    id: number | null
    oidcId: string | null
    username: string | null
    quota: bigint | null
    usedQuota: bigint | null
    status: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NewApiUserCountAggregateOutputType = {
    id: number
    oidcId: number
    username: number
    quota: number
    usedQuota: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NewApiUserAvgAggregateInputType = {
    id?: true
    quota?: true
    usedQuota?: true
    status?: true
  }

  export type NewApiUserSumAggregateInputType = {
    id?: true
    quota?: true
    usedQuota?: true
    status?: true
  }

  export type NewApiUserMinAggregateInputType = {
    id?: true
    oidcId?: true
    username?: true
    quota?: true
    usedQuota?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NewApiUserMaxAggregateInputType = {
    id?: true
    oidcId?: true
    username?: true
    quota?: true
    usedQuota?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NewApiUserCountAggregateInputType = {
    id?: true
    oidcId?: true
    username?: true
    quota?: true
    usedQuota?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NewApiUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewApiUser to aggregate.
     */
    where?: NewApiUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewApiUsers to fetch.
     */
    orderBy?: NewApiUserOrderByWithRelationInput | NewApiUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewApiUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewApiUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewApiUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewApiUsers
    **/
    _count?: true | NewApiUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewApiUserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewApiUserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewApiUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewApiUserMaxAggregateInputType
  }

  export type GetNewApiUserAggregateType<T extends NewApiUserAggregateArgs> = {
        [P in keyof T & keyof AggregateNewApiUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewApiUser[P]>
      : GetScalarType<T[P], AggregateNewApiUser[P]>
  }




  export type NewApiUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewApiUserWhereInput
    orderBy?: NewApiUserOrderByWithAggregationInput | NewApiUserOrderByWithAggregationInput[]
    by: NewApiUserScalarFieldEnum[] | NewApiUserScalarFieldEnum
    having?: NewApiUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewApiUserCountAggregateInputType | true
    _avg?: NewApiUserAvgAggregateInputType
    _sum?: NewApiUserSumAggregateInputType
    _min?: NewApiUserMinAggregateInputType
    _max?: NewApiUserMaxAggregateInputType
  }

  export type NewApiUserGroupByOutputType = {
    id: number
    oidcId: string | null
    username: string
    quota: bigint
    usedQuota: bigint
    status: number
    createdAt: Date
    updatedAt: Date
    _count: NewApiUserCountAggregateOutputType | null
    _avg: NewApiUserAvgAggregateOutputType | null
    _sum: NewApiUserSumAggregateOutputType | null
    _min: NewApiUserMinAggregateOutputType | null
    _max: NewApiUserMaxAggregateOutputType | null
  }

  type GetNewApiUserGroupByPayload<T extends NewApiUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewApiUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewApiUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewApiUserGroupByOutputType[P]>
            : GetScalarType<T[P], NewApiUserGroupByOutputType[P]>
        }
      >
    >


  export type NewApiUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oidcId?: boolean
    username?: boolean
    quota?: boolean
    usedQuota?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["newApiUser"]>

  export type NewApiUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oidcId?: boolean
    username?: boolean
    quota?: boolean
    usedQuota?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["newApiUser"]>

  export type NewApiUserSelectScalar = {
    id?: boolean
    oidcId?: boolean
    username?: boolean
    quota?: boolean
    usedQuota?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $NewApiUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewApiUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      oidcId: string | null
      username: string
      quota: bigint
      usedQuota: bigint
      status: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["newApiUser"]>
    composites: {}
  }

  type NewApiUserGetPayload<S extends boolean | null | undefined | NewApiUserDefaultArgs> = $Result.GetResult<Prisma.$NewApiUserPayload, S>

  type NewApiUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NewApiUserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NewApiUserCountAggregateInputType | true
    }

  export interface NewApiUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewApiUser'], meta: { name: 'NewApiUser' } }
    /**
     * Find zero or one NewApiUser that matches the filter.
     * @param {NewApiUserFindUniqueArgs} args - Arguments to find a NewApiUser
     * @example
     * // Get one NewApiUser
     * const newApiUser = await prisma.newApiUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewApiUserFindUniqueArgs>(args: SelectSubset<T, NewApiUserFindUniqueArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NewApiUser that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NewApiUserFindUniqueOrThrowArgs} args - Arguments to find a NewApiUser
     * @example
     * // Get one NewApiUser
     * const newApiUser = await prisma.newApiUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewApiUserFindUniqueOrThrowArgs>(args: SelectSubset<T, NewApiUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NewApiUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserFindFirstArgs} args - Arguments to find a NewApiUser
     * @example
     * // Get one NewApiUser
     * const newApiUser = await prisma.newApiUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewApiUserFindFirstArgs>(args?: SelectSubset<T, NewApiUserFindFirstArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NewApiUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserFindFirstOrThrowArgs} args - Arguments to find a NewApiUser
     * @example
     * // Get one NewApiUser
     * const newApiUser = await prisma.newApiUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewApiUserFindFirstOrThrowArgs>(args?: SelectSubset<T, NewApiUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NewApiUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewApiUsers
     * const newApiUsers = await prisma.newApiUser.findMany()
     * 
     * // Get first 10 NewApiUsers
     * const newApiUsers = await prisma.newApiUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newApiUserWithIdOnly = await prisma.newApiUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewApiUserFindManyArgs>(args?: SelectSubset<T, NewApiUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NewApiUser.
     * @param {NewApiUserCreateArgs} args - Arguments to create a NewApiUser.
     * @example
     * // Create one NewApiUser
     * const NewApiUser = await prisma.newApiUser.create({
     *   data: {
     *     // ... data to create a NewApiUser
     *   }
     * })
     * 
     */
    create<T extends NewApiUserCreateArgs>(args: SelectSubset<T, NewApiUserCreateArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NewApiUsers.
     * @param {NewApiUserCreateManyArgs} args - Arguments to create many NewApiUsers.
     * @example
     * // Create many NewApiUsers
     * const newApiUser = await prisma.newApiUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewApiUserCreateManyArgs>(args?: SelectSubset<T, NewApiUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewApiUsers and returns the data saved in the database.
     * @param {NewApiUserCreateManyAndReturnArgs} args - Arguments to create many NewApiUsers.
     * @example
     * // Create many NewApiUsers
     * const newApiUser = await prisma.newApiUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewApiUsers and only return the `id`
     * const newApiUserWithIdOnly = await prisma.newApiUser.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewApiUserCreateManyAndReturnArgs>(args?: SelectSubset<T, NewApiUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NewApiUser.
     * @param {NewApiUserDeleteArgs} args - Arguments to delete one NewApiUser.
     * @example
     * // Delete one NewApiUser
     * const NewApiUser = await prisma.newApiUser.delete({
     *   where: {
     *     // ... filter to delete one NewApiUser
     *   }
     * })
     * 
     */
    delete<T extends NewApiUserDeleteArgs>(args: SelectSubset<T, NewApiUserDeleteArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NewApiUser.
     * @param {NewApiUserUpdateArgs} args - Arguments to update one NewApiUser.
     * @example
     * // Update one NewApiUser
     * const newApiUser = await prisma.newApiUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewApiUserUpdateArgs>(args: SelectSubset<T, NewApiUserUpdateArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NewApiUsers.
     * @param {NewApiUserDeleteManyArgs} args - Arguments to filter NewApiUsers to delete.
     * @example
     * // Delete a few NewApiUsers
     * const { count } = await prisma.newApiUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewApiUserDeleteManyArgs>(args?: SelectSubset<T, NewApiUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewApiUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewApiUsers
     * const newApiUser = await prisma.newApiUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewApiUserUpdateManyArgs>(args: SelectSubset<T, NewApiUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewApiUser.
     * @param {NewApiUserUpsertArgs} args - Arguments to update or create a NewApiUser.
     * @example
     * // Update or create a NewApiUser
     * const newApiUser = await prisma.newApiUser.upsert({
     *   create: {
     *     // ... data to create a NewApiUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewApiUser we want to update
     *   }
     * })
     */
    upsert<T extends NewApiUserUpsertArgs>(args: SelectSubset<T, NewApiUserUpsertArgs<ExtArgs>>): Prisma__NewApiUserClient<$Result.GetResult<Prisma.$NewApiUserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NewApiUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserCountArgs} args - Arguments to filter NewApiUsers to count.
     * @example
     * // Count the number of NewApiUsers
     * const count = await prisma.newApiUser.count({
     *   where: {
     *     // ... the filter for the NewApiUsers we want to count
     *   }
     * })
    **/
    count<T extends NewApiUserCountArgs>(
      args?: Subset<T, NewApiUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewApiUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewApiUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewApiUserAggregateArgs>(args: Subset<T, NewApiUserAggregateArgs>): Prisma.PrismaPromise<GetNewApiUserAggregateType<T>>

    /**
     * Group by NewApiUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewApiUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewApiUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewApiUserGroupByArgs['orderBy'] }
        : { orderBy?: NewApiUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewApiUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewApiUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewApiUser model
   */
  readonly fields: NewApiUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewApiUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewApiUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewApiUser model
   */ 
  interface NewApiUserFieldRefs {
    readonly id: FieldRef<"NewApiUser", 'Int'>
    readonly oidcId: FieldRef<"NewApiUser", 'String'>
    readonly username: FieldRef<"NewApiUser", 'String'>
    readonly quota: FieldRef<"NewApiUser", 'BigInt'>
    readonly usedQuota: FieldRef<"NewApiUser", 'BigInt'>
    readonly status: FieldRef<"NewApiUser", 'Int'>
    readonly createdAt: FieldRef<"NewApiUser", 'DateTime'>
    readonly updatedAt: FieldRef<"NewApiUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewApiUser findUnique
   */
  export type NewApiUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * Filter, which NewApiUser to fetch.
     */
    where: NewApiUserWhereUniqueInput
  }

  /**
   * NewApiUser findUniqueOrThrow
   */
  export type NewApiUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * Filter, which NewApiUser to fetch.
     */
    where: NewApiUserWhereUniqueInput
  }

  /**
   * NewApiUser findFirst
   */
  export type NewApiUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * Filter, which NewApiUser to fetch.
     */
    where?: NewApiUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewApiUsers to fetch.
     */
    orderBy?: NewApiUserOrderByWithRelationInput | NewApiUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewApiUsers.
     */
    cursor?: NewApiUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewApiUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewApiUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewApiUsers.
     */
    distinct?: NewApiUserScalarFieldEnum | NewApiUserScalarFieldEnum[]
  }

  /**
   * NewApiUser findFirstOrThrow
   */
  export type NewApiUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * Filter, which NewApiUser to fetch.
     */
    where?: NewApiUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewApiUsers to fetch.
     */
    orderBy?: NewApiUserOrderByWithRelationInput | NewApiUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewApiUsers.
     */
    cursor?: NewApiUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewApiUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewApiUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewApiUsers.
     */
    distinct?: NewApiUserScalarFieldEnum | NewApiUserScalarFieldEnum[]
  }

  /**
   * NewApiUser findMany
   */
  export type NewApiUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * Filter, which NewApiUsers to fetch.
     */
    where?: NewApiUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewApiUsers to fetch.
     */
    orderBy?: NewApiUserOrderByWithRelationInput | NewApiUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewApiUsers.
     */
    cursor?: NewApiUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewApiUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewApiUsers.
     */
    skip?: number
    distinct?: NewApiUserScalarFieldEnum | NewApiUserScalarFieldEnum[]
  }

  /**
   * NewApiUser create
   */
  export type NewApiUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * The data needed to create a NewApiUser.
     */
    data: XOR<NewApiUserCreateInput, NewApiUserUncheckedCreateInput>
  }

  /**
   * NewApiUser createMany
   */
  export type NewApiUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewApiUsers.
     */
    data: NewApiUserCreateManyInput | NewApiUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewApiUser createManyAndReturn
   */
  export type NewApiUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NewApiUsers.
     */
    data: NewApiUserCreateManyInput | NewApiUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewApiUser update
   */
  export type NewApiUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * The data needed to update a NewApiUser.
     */
    data: XOR<NewApiUserUpdateInput, NewApiUserUncheckedUpdateInput>
    /**
     * Choose, which NewApiUser to update.
     */
    where: NewApiUserWhereUniqueInput
  }

  /**
   * NewApiUser updateMany
   */
  export type NewApiUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewApiUsers.
     */
    data: XOR<NewApiUserUpdateManyMutationInput, NewApiUserUncheckedUpdateManyInput>
    /**
     * Filter which NewApiUsers to update
     */
    where?: NewApiUserWhereInput
  }

  /**
   * NewApiUser upsert
   */
  export type NewApiUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * The filter to search for the NewApiUser to update in case it exists.
     */
    where: NewApiUserWhereUniqueInput
    /**
     * In case the NewApiUser found by the `where` argument doesn't exist, create a new NewApiUser with this data.
     */
    create: XOR<NewApiUserCreateInput, NewApiUserUncheckedCreateInput>
    /**
     * In case the NewApiUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewApiUserUpdateInput, NewApiUserUncheckedUpdateInput>
  }

  /**
   * NewApiUser delete
   */
  export type NewApiUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
    /**
     * Filter which NewApiUser to delete.
     */
    where: NewApiUserWhereUniqueInput
  }

  /**
   * NewApiUser deleteMany
   */
  export type NewApiUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewApiUsers to delete
     */
    where?: NewApiUserWhereInput
  }

  /**
   * NewApiUser without action
   */
  export type NewApiUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewApiUser
     */
    select?: NewApiUserSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const NewApiUserScalarFieldEnum: {
    id: 'id',
    oidcId: 'oidcId',
    username: 'username',
    quota: 'quota',
    usedQuota: 'usedQuota',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NewApiUserScalarFieldEnum = (typeof NewApiUserScalarFieldEnum)[keyof typeof NewApiUserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type NewApiUserWhereInput = {
    AND?: NewApiUserWhereInput | NewApiUserWhereInput[]
    OR?: NewApiUserWhereInput[]
    NOT?: NewApiUserWhereInput | NewApiUserWhereInput[]
    id?: IntFilter<"NewApiUser"> | number
    oidcId?: StringNullableFilter<"NewApiUser"> | string | null
    username?: StringFilter<"NewApiUser"> | string
    quota?: BigIntFilter<"NewApiUser"> | bigint | number
    usedQuota?: BigIntFilter<"NewApiUser"> | bigint | number
    status?: IntFilter<"NewApiUser"> | number
    createdAt?: DateTimeFilter<"NewApiUser"> | Date | string
    updatedAt?: DateTimeFilter<"NewApiUser"> | Date | string
  }

  export type NewApiUserOrderByWithRelationInput = {
    id?: SortOrder
    oidcId?: SortOrderInput | SortOrder
    username?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewApiUserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    oidcId?: string
    AND?: NewApiUserWhereInput | NewApiUserWhereInput[]
    OR?: NewApiUserWhereInput[]
    NOT?: NewApiUserWhereInput | NewApiUserWhereInput[]
    username?: StringFilter<"NewApiUser"> | string
    quota?: BigIntFilter<"NewApiUser"> | bigint | number
    usedQuota?: BigIntFilter<"NewApiUser"> | bigint | number
    status?: IntFilter<"NewApiUser"> | number
    createdAt?: DateTimeFilter<"NewApiUser"> | Date | string
    updatedAt?: DateTimeFilter<"NewApiUser"> | Date | string
  }, "id" | "oidcId">

  export type NewApiUserOrderByWithAggregationInput = {
    id?: SortOrder
    oidcId?: SortOrderInput | SortOrder
    username?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NewApiUserCountOrderByAggregateInput
    _avg?: NewApiUserAvgOrderByAggregateInput
    _max?: NewApiUserMaxOrderByAggregateInput
    _min?: NewApiUserMinOrderByAggregateInput
    _sum?: NewApiUserSumOrderByAggregateInput
  }

  export type NewApiUserScalarWhereWithAggregatesInput = {
    AND?: NewApiUserScalarWhereWithAggregatesInput | NewApiUserScalarWhereWithAggregatesInput[]
    OR?: NewApiUserScalarWhereWithAggregatesInput[]
    NOT?: NewApiUserScalarWhereWithAggregatesInput | NewApiUserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"NewApiUser"> | number
    oidcId?: StringNullableWithAggregatesFilter<"NewApiUser"> | string | null
    username?: StringWithAggregatesFilter<"NewApiUser"> | string
    quota?: BigIntWithAggregatesFilter<"NewApiUser"> | bigint | number
    usedQuota?: BigIntWithAggregatesFilter<"NewApiUser"> | bigint | number
    status?: IntWithAggregatesFilter<"NewApiUser"> | number
    createdAt?: DateTimeWithAggregatesFilter<"NewApiUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NewApiUser"> | Date | string
  }

  export type NewApiUserCreateInput = {
    oidcId?: string | null
    username?: string
    quota?: bigint | number
    usedQuota?: bigint | number
    status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NewApiUserUncheckedCreateInput = {
    id?: number
    oidcId?: string | null
    username?: string
    quota?: bigint | number
    usedQuota?: bigint | number
    status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NewApiUserUpdateInput = {
    oidcId?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    quota?: BigIntFieldUpdateOperationsInput | bigint | number
    usedQuota?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewApiUserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    oidcId?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    quota?: BigIntFieldUpdateOperationsInput | bigint | number
    usedQuota?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewApiUserCreateManyInput = {
    id?: number
    oidcId?: string | null
    username?: string
    quota?: bigint | number
    usedQuota?: bigint | number
    status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NewApiUserUpdateManyMutationInput = {
    oidcId?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    quota?: BigIntFieldUpdateOperationsInput | bigint | number
    usedQuota?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewApiUserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    oidcId?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    quota?: BigIntFieldUpdateOperationsInput | bigint | number
    usedQuota?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type NewApiUserCountOrderByAggregateInput = {
    id?: SortOrder
    oidcId?: SortOrder
    username?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewApiUserAvgOrderByAggregateInput = {
    id?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
  }

  export type NewApiUserMaxOrderByAggregateInput = {
    id?: SortOrder
    oidcId?: SortOrder
    username?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewApiUserMinOrderByAggregateInput = {
    id?: SortOrder
    oidcId?: SortOrder
    username?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewApiUserSumOrderByAggregateInput = {
    id?: SortOrder
    quota?: SortOrder
    usedQuota?: SortOrder
    status?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use NewApiUserDefaultArgs instead
     */
    export type NewApiUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NewApiUserDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}