import { ChatIcon } from './ChatIcon'

interface ForecastRow { year_month: string; predicted_demand: number }
interface ForecastData {
  model_name?: string
  model_version?: string
  forecast: ForecastRow[]
}

function isForecastData(data: unknown): data is ForecastData {
  if (typeof data !== 'object' || data === null || !('forecast' in data) || !Array.isArray(data.forecast)) return false
  return data.forecast.every(row => typeof row === 'object' && row !== null
    && typeof row.year_month === 'string' && Number.isFinite(Date.parse(row.year_month))
    && typeof row.predicted_demand === 'number' && Number.isFinite(row.predicted_demand))
}

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const monthLabel = (date: string) => new Date(date).toLocaleDateString(undefined, { month: 'short', year: 'numeric', timeZone: 'UTC' })

export function ForecastCard({ data }: { data: unknown }) {
  if (!isForecastData(data)) {
    return <div className="forecast-card"><h3>Forecast data</h3><p>The result is not in the expected forecast format.</p><details><summary>View returned data</summary><pre>{JSON.stringify(data, null, 2) ?? 'No data returned.'}</pre></details></div>
  }
  if (!data.forecast.length) return <div className="forecast-card"><h3>Demand forecast</h3><p>No forecast periods were returned.</p></div>
  const total = data.forecast.reduce((sum, row) => sum + row.predicted_demand, 0)
  const max = Math.max(1, ...data.forecast.map(row => row.predicted_demand))
  return <section className="forecast-card" aria-label="Demand forecast">
    <div className="forecast-heading"><span className="forecast-icon"><ChatIcon name="chart" /></span><div><h3>Demand forecast</h3><p>{monthLabel(data.forecast[0].year_month)} – {monthLabel(data.forecast.at(-1)!.year_month)}</p></div><span className="forecast-badge">Forecast</span></div>
    <div className="forecast-metrics">
      <div><span>Total demand</span><strong>{numberFormat.format(total)} <small>units</small></strong></div>
      <div><span>Monthly average</span><strong>{numberFormat.format(total / data.forecast.length)} <small>units</small></strong></div>
      <div><span>Forecast horizon</span><strong>{data.forecast.length} <small>{data.forecast.length === 1 ? 'month' : 'months'}</small></strong></div>
    </div>
    <div className="forecast-table-wrap"><table className="forecast-table">
      <caption>Predicted demand by month</caption>
      <thead><tr><th scope="col">Month</th><th scope="col">Demand distribution</th><th scope="col">Predicted units</th></tr></thead>
      <tbody>{data.forecast.map((row, index) => <tr key={`${row.year_month}-${index}`}><th scope="row">{monthLabel(row.year_month)}</th><td><div className="forecast-bar-track" aria-hidden="true"><div style={{ width: `${Math.max(0, row.predicted_demand) / max * 100}%` }} /></div></td><td>{numberFormat.format(row.predicted_demand)}</td></tr>)}</tbody>
    </table></div>
    {typeof data.model_name === 'string' && <p className="forecast-model">Model: {data.model_name}{typeof data.model_version === 'string' ? ` · ${data.model_version}` : ''}</p>}
    <details><summary>View full forecast data</summary><pre>{JSON.stringify(data, null, 2)}</pre></details>
  </section>
}
