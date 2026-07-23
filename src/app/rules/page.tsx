import { lotteryConfig, rawToUsd } from "@/config/lottery.config";

export const metadata = { title: "抽奖规则 - AI 抽奖" };

export default function RulesPage() {
  const tiers = [...lotteryConfig.tiers].sort((a, b) => b.weight - a.weight);
  const totalWeight = tiers.reduce((s, t) => s + t.weight, 0);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">抽奖规则</h1>

      <section className="mb-8 space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300">
        <p>• 单抽消耗 <b className="text-white">{lotteryConfig.singleCost}</b> 次抽奖机会</p>
        <p>• 十连消耗 <b className="text-white">{lotteryConfig.tenRollCost}</b> 次抽奖机会</p>
        {lotteryConfig.tenRollGuarantee && (
          <p>• 十连保底：至少出一个 <b className="text-white">
            {lotteryConfig.tiers.find(t => t.key === lotteryConfig.tenRollGuarantee)?.label}
          </b></p>
        )}
        <p>• 每累计充值 <b className="text-white">1 美元</b> 赠送 <b className="text-white">{lotteryConfig.rechargeGift.perUsd}</b> 次抽奖</p>
        {lotteryConfig.rechargeGift.maxGifted !== undefined && (
          <p>• 充值赠送累计上限 <b className="text-white">{lotteryConfig.rechargeGift.maxGifted}</b> 次</p>
        )}
        <p>• 中奖余额会实时添加到 newapi 账号 quota 中</p>
      </section>

      <h2 className="mb-3 text-lg font-bold">概率与金额</h2>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/70 text-slate-400">
            <tr>
              <th className="px-4 py-2 text-left">等级</th>
              <th className="px-4 py-2 text-left">概率</th>
              <th className="px-4 py-2 text-left">金额（美元）</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map(t => {
              const prob = (t.weight / totalWeight * 100).toFixed(2);
              return (
                <tr key={t.key} className="border-t border-slate-800">
                  <td className="px-4 py-2">
                    <span className={`inline-block rounded bg-gradient-to-r ${t.color} px-2 py-0.5 text-xs font-bold`}>
                      {t.label}
                    </span>
                    {t.isJackpot && <span className="ml-2">🏆</span>}
                  </td>
                  <td className="px-4 py-2">{prob}%</td>
                  <td className="px-4 py-2">
                    ${t.amount[0]} ~ ${t.amount[1]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <a
          href="/login"
          className="text-sm text-brand-400 hover:text-brand-300"
        >
          ← 返回登录
        </a>
      </div>
    </main>
  );
}
