const userData = [
  { x: '昆明市', y: 50000 },
  { x: '曲靖市', y: 35000 },
  { x: '丽江市', y: 25000 },
  { x: '临沧市', y: 15000 },
  { x: '普洱市', y: 8000 },
];

const greenData = [
  {
    x: '家用电器',
    y: 4544,
  },
  {
    x: '食用酒水',
    y: 3321,
  },
  {
    x: '个护健康',
    y: 3113,
  },
  {
    x: '服饰箱包',
    y: 2341,
  },
  {
    x: '母婴产品',
    y: 1231,
  },
  {
    x: '其他',
    y: 1231,
  },
];

function getTwoData() {
  const twoData = [];
  for (let i = 0; i < 12; i += 1) {
    twoData.push({
      x: i + 1 + '月',
      y1: Math.floor(Math.random() * 1000) + 200,
      y2: Math.floor(Math.random() * 1000) + 200,
    });
  }
  return twoData;
}

function getCpiData() {
  const cpiData = [];
  for (let i = 0; i < 12; i += 1) {
    cpiData.push({
      x: i + 1 + '月',
      y1: Math.floor(Math.random() * 100) + 10,
      y2: Math.floor(Math.random() * 100) + 10,
      y3: Math.floor(Math.random() * 100) + 10,
    });
  }
  return cpiData;
}

export function getBigScreenData(req, res) {
  const result = {
    tradeData: getTwoData(),
    userData,
    greenData,
    cpiData: getCpiData(),
    priceData: getTwoData(),
    trendData: getTwoData(),
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getBigScreenData,
};
