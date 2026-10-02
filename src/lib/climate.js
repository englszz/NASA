export function summarizeClimate(data, date, thresholds) {
  const monthDay = date.replaceAll('-', '').slice(4);
  if (!/^\d{4}$/.test(monthDay)) return [];
  const parameters = data.properties.parameter;
  const definitions = [
    ['PRECTOTCORR', 'Precipitación', 'mm/día', thresholds.rain],
    ['T2M_MAX', 'Temperatura máxima', '°C', thresholds.heat],
    ['WS10M_MAX', 'Viento máximo a 10 m', 'm/s', thresholds.wind],
    ['T2M_MIN', 'Temperatura mínima', '°C', null],
    ['RH2M', 'Humedad relativa', '%', null],
  ];
  return definitions.map(([key, label, unit, threshold]) => {
    const values = Object.entries(parameters[key] || {})
      .filter(([day, value]) => day.slice(4) === monthDay && Number.isFinite(value) && value !== data.header.fill_value)
      .map(([, value]) => value);
    const count = values.length;
    const exceeded = threshold === null ? null : values.filter(value => value >= threshold).length;
    return { key, label, unit, threshold, count, exceeded,
      average: count ? values.reduce((sum, value) => sum + value, 0) / count : null,
      probability: count && threshold !== null ? exceeded / count * 100 : null };
  });
}
