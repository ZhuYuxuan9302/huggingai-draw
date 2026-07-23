/**
 * BigInt → string / Date → ISO string 递归序列化器
 *
 * JSON.stringify 默认不支持 BigInt，会抛
 *   "Do not know how to serialize a BigInt"
 * 而我们的 API 响应经常包含 BigInt 字段（raw quota、granted_balance_raw、amountRaw 等）
 *
 * 统一在 API route 返回前用 safeJson 把整个响应体里的 BigInt
 * 转成 string，前端期望 *Raw 字段也都标成 string。
 *
 * 参数类型用 unknown 而非严格的 Jsonifiable interface，
 * 避免调用处报 "Index signature for type 'string' is missing in type XXX"
 * —— interface 没 index signature 这事是 TS 设计，不是运行时有问题。
 */

export function toJsonable(obj: unknown): unknown {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (typeof obj === "bigint") return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map((x) => toJsonable(x));
  if (typeof obj === "object") {
    const out: Record<string, unknown> = {};
    const src = obj as Record<string, unknown>;
    for (const k of Object.keys(src)) {
      out[k] = toJsonable(src[k]);
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
export function safeJson<T>(obj: T): unknown {
  return toJsonable(obj);
}
