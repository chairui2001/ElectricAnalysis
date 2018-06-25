import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'big-screen',
  },
  {
    name: '行业分析',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '电解铝',
        path: 'analysis',
      },
      {
        name: '电解硅',
        path: 'workplace',
      },
    ],
  },
  {
    name: '历史用电',
    icon: 'line-chart',
    path: 'dashboard/monitor',
  },
  {
    name: '趋势预测',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '报告管理',
        path: 'table-list',
      },
      {
        name: '金融数据',
        path: 'basic-list',
      },
    ],
  },
  {
    name: '用户信息',
    icon: 'profile',
    path: 'profile/basic',
  },
  {
    name: '系统设置',
    authority: 'admin',
    icon: 'form',
    path: 'form/advanced-form',
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
