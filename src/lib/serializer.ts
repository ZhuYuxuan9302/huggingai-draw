/**
 * BigInt → string 递归序列化器
 *
 * JSON.stringify 默认不支持 BigInt，会抛
 *   "Do not know how to serialize a BigInt"
 * 而我们的 API 响应经常包含 BigInt 字段
 *   （raw quota、granted_balance_raw、amountRaw 等）
 *
 * 统一在 API route 返回前用 safeJson 把整个响应体里的 BigInt
 * 转成 string。前端 interface 里所有 *Raw 字段也都标成 string。
 *
 * 另一种方案是给 NextResponse.json 传自定义 replacer，但 Helper:
 *   Jsonify -> 递归枚举对象/数组即可
 */

export type Jsonifiable =
  | string
  | number
  | boolean
  | null
  | bigint
  | Date
  | Jsonifiable[]
  | { [key: string]: Jsonifiable };

export function toJsonable(obj: Jsonifiable | undefined): unknown {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (typeof obj === "bigint") return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map((x) => toJsonable(x));
  if (typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = toJsonable(v as Jsonifiable);
    }
    return out;
  }
  // string / number / boolean
  return obj;
}

/**
 * 把对象转成「前端兼容」结构（BigInt → string，Date → ISO string）。
 * 在所有返回含 BigInt 字段的 API route 用：
 *   return NextResponse.json(safeJson({ data: result }));
 */
export function safeJson<T extends Jsonifiable>(obj: T): unknown {
  return toJsonable(obj);
}
