import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useWorktabStore } from '@/store/modules/worktab'
import Home from '@views/index/index.vue'
import { SystemInfo } from '@/config/setting'
import { useUserStore } from '@/store/modules/user'
import { menuService } from '@/api/menuApi'
import { routerMatch } from '@/utils/menu'
import { useMenuStore } from '@/store/modules/menu'
import { useSettingStore } from '@/store/modules/setting'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 顶部进度条配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 600, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  parent: 'body' //指定进度条的父容器
})

// 路由项扩展
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean
}

// 首页
export const HOME_PAGE = '/dashboard/console'

// 不需要权限的路由
const routes = [
  {
    path: '/',
    redirect: HOME_PAGE
  },
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '监控中心',
      title_en: 'Dashboard'
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: () => import(`@views/dashboard/Console/index.vue`),
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: false
        }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import(`@views/dashboard/analysis/index.vue`),
        meta: {
          title: '分析页',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@views/login/index.vue'),
    meta: {
      title: '登录',
      isHideTab: true
    }
  },
  {
    path: '/register',
    component: () => import('@views/register/index.vue'),
    meta: {
      title: '注册',
      isHideTab: true,
      noLogin: true
    }
  },
  {
    path: '/forget-password',
    component: () => import('@views/forget-password/index.vue'),
    meta: {
      title: '忘记密码',
      isHideTab: true,
      noLogin: true
    }
  },
  {
    path: '/exception',
    component: Home,
    meta: {
      title: '异常页面',
      title_en: 'Exception'
    },
    children: [
      {
        path: '403',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '403',
          title_en: '403'
        }
      },
      {
        path: '404',
        component: () => import('@views/exception/404.vue'),
        meta: {
          title: '404',
          title_en: '404'
        }
      },
      {
        path: '500',
        component: () => import('@views/exception/500.vue'),
        meta: {
          title: '500',
          title_en: '500'
        }
      }
    ]
  },
  {
    path: '/outside',
    component: Home,
    meta: {
      title: '内嵌页面',
      title_en: 'Outside'
    },
    children: [
      {
        path: '/outside/iframe',
        component: () => import('@/views/outside/Iframe.vue'),
        meta: {
          title: 'iframe',
          title_en: 'iframe'
        }
      }
    ]
  }
] as AppRouteRecordRaw[]

export const router = createRouter({
  history: createWebHashHistory(), // history 模式
  routes: routes, // 路由表
  scrollBehavior: () => ({ left: 0, top: 0 }) // 页面滚动行为
})

// 需要权限的路由
export const roleRoutes: AppRouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    component: Home,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: '/user/user',
        name: 'Users',
        component: () => import('@views/user/User.vue'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: '/user/account',
        name: 'Account',
        component: () => import('@views/user/Account.vue'),
        meta: {
          title: '账号管理'
        }
      },
      {
        path: '/user/department',
        name: 'Department',
        component: () => import('@views/user/Department.vue'),
        meta: {
          title: '部门管理'
        }
      },
      {
        path: '/user/role',
        name: 'Role',
        component: () => import('@views/user/Role.vue'),
        meta: {
          title: '角色权限'
        }
      }
    ]
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Home,
    meta: {
      title: '菜单管理',
      title_en: 'Menu Management'
    },
    children: [
      {
        path: '/menu/menu',
        name: 'Menus',
        component: () => import('@views/menu/Menu.vue'),
        meta: {
          title: '菜单管理',
          title_en: 'Menu Management'
        }
      },
      {
        path: '/menu/permission',
        name: 'Permission',
        component: () => import('@views/menu/Permission.vue'),
        meta: {
          title: '权限控制',
          title_en: 'Permission Control'
        }
      },
      {
        path: '/menu/nested',
        name: 'Nested',
        meta: {
          title: '嵌套菜单',
          title_en: 'Nested Menu'
        },
        children: [
          {
            path: '/menu/nested/menu1',
            name: 'NestedMenu1',
            component: () => import('@views/menu/nested/Menu1.vue'),
            meta: {
              title: '菜单1',
              title_en: 'Menu 1'
            }
          },
          {
            path: '/menu/nested/menu2',
            name: 'NestedMenu2',
            meta: {
              title: '菜单2',
              title_en: 'Menu 2'
            },
            children: [
              {
                path: '/menu/nested/menu2/menu2-1',
                name: 'NestedMenu2-1',
                component: () => import('@views/menu/nested/menu2/Menu2-1.vue'),
                meta: {
                  title: '菜单2-1',
                  title_en: 'Menu 2-1'
                }
              }
            ]
          },
          {
            path: '/menu/nested/menu3',
            name: 'NestedMenu3',
            meta: {
              title: '菜单3',
              title_en: 'Menu 3'
            },
            children: [
              {
                path: '/menu/nested/menu3/menu3-1',
                name: 'NestedMenu3-1',
                component: () => import('@views/menu/nested/menu3/Menu3-1.vue'),
                meta: {
                  title: '菜单3-1',
                  title_en: 'Menu 3-1'
                }
              },
              {
                path: '/menu/nested/menu3/menu3-2',
                name: 'NestedMenu3-2',
                meta: {
                  title: '菜单3-2',
                  title_en: 'Menu 3-2'
                },
                children: [
                  {
                    path: '/menu/nested/menu3/menu3-2/menu3-2-1',
                    name: 'NestedMenu3-2-1',
                    component: () => import('@views/menu/nested/menu3/menu3-2/Menu3-2-1.vue'),
                    meta: {
                      title: '菜单3-2-1',
                      title_en: 'Menu 3-2-1'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/result',
    name: 'Result',
    component: Home,
    meta: {
      title: '结果页面'
    },
    children: [
      {
        path: '/result/success',
        name: 'Success',
        component: () => import('@views/result/Success.vue'),
        meta: {
          title: '成功页'
        }
      },
      {
        path: '/result/fail',
        name: 'Fail',
        component: () => import('@views/result/Fail.vue'),
        meta: {
          title: '失败页'
        }
      }
    ]
  },
  {
    path: '/article',
    component: Home,
    name: 'Article',
    meta: {
      title: '文章管理'
    },
    children: [
      {
        path: '/article/article-publish',
        component: () => import('@views/article/ArticlePublish.vue'),
        meta: {
          title: '文章发布'
        }
      },
      {
        path: '/article/article-list',
        component: () => import('@views/article/ArticleList.vue'),
        meta: {
          title: '文章列表'
        }
      },
      {
        path: '/article/detail',
        component: () => import('@views/article/ArticleDetail.vue'),
        meta: {
          title: '文章详情',
          isHideTab: true
        }
      },
      {
        path: '/article/classify',
        component: () => import('@views/article/Classify.vue'),
        meta: {
          title: '文章分类'
        }
      },
      {
        path: '/article/comment',
        component: () => import('@views/article/Comment.vue'),
        meta: {
          title: '留言'
        }
      }
    ]
  },
  {
    path: '/widgets',
    component: Home,
    name: 'Widgets',
    meta: {
      title: '组件库'
    },
    children: [
      {
        path: '/widgets/icon-list',
        component: () => import('@views/widgets/IconList.vue'),
        meta: {
          title: '图标库'
        }
      },
      {
        path: '/widgets/icon-selector',
        component: () => import('@views/widgets/IconSelector.vue'),
        meta: {
          title: '图标选择器'
        }
      }
    ]
  },
  {
    path: '/message',
    component: Home,
    name: 'Message',
    meta: {
      title: '消息中心'
    },
    children: [
      {
        path: '/message/message',
        component: () => import('@views/message/Index.vue'),
        meta: {
          title: '系统消息'
        }
      }
    ]
  },
  {
    path: '/system',
    component: Home,
    name: 'System',
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: '/system/setting',
        component: () => import('@views/system/Setting.vue'),
        meta: {
          title: '系统设置'
        }
      },
      {
        path: '/system/api',
        name: 'Api',
        component: () => import('@views/system/Api.vue'),
        meta: {
          title: 'API管理'
        }
      },
      {
        path: '/system/log',
        component: () => import('@views/system/Log.vue'),
        meta: {
          title: '系统日志'
        }
      }
    ]
  },
  {
    path: '/safeguard',
    component: Home,
    name: 'Safeguard',
    meta: {
      title: '运维管理'
    },
    children: [
      {
        path: '/safeguard/server',
        component: () => import('@views/safeguard/Server.vue'),
        meta: {
          title: '服务器管理'
        }
      }
    ]
  },
  {
    path: '/plan',
    component: Home,
    name: 'Plan',
    meta: {
      title: '版本计划'
    },
    children: [
      {
        path: '/plan/index',
        component: () => import('@views/plan/index.vue'),
        meta: {
          title: '更新计划'
        }
      }
    ]
  }
]

export const allRoutes = roleRoutes

// 是否注册路由
const isRouteRegistered = ref(false)

router.beforeEach(async (to, from, next) => {
  if (useSettingStore().showNprogress) {
    NProgress.start()
  }

  const userStore = useUserStore()
  const worktabStore = useWorktabStore()
  const { meta, path, params, query } = to
  const { title, title_en: titleEn, isHideTab, noLogin } = meta

  if (!userStore.isLogin && path !== '/login' && !noLogin) {
    userStore.logOut()
    next('/login')
    return
  }

  // 获取菜单，注册路由
  if (!isRouteRegistered.value) {
    try {
      await registerRoutes()
      next({ ...to, replace: true })
    } catch (error) {
      console.error('Failed to register routes:', error)
      next('/exception/500')
    }
    return
  }

  if (to.matched.length === 0) {
    next('/exception/404')
    return
  }

  if (!isHideTab) {
    worktabStore.router({
      title: title as string,
      title_en: titleEn as string,
      path,
      params,
      query
    })
  }

  if (title) {
    document.title = `${title} - ${SystemInfo.name}`
  }

  next()
})

router.afterEach(() => {
  if (useSettingStore().showNprogress) {
    NProgress.done()
  }
})

// 获取菜单，注册路由
async function registerRoutes(): Promise<void> {
  try {
    const { menuList, closeLoading } = await menuService.getMenuList()

    if (!Array.isArray(menuList) || menuList.length === 0) {
      throw new Error('获取菜单列表未空')
    }

    // 设置菜单列表
    useMenuStore().setMenuList(menuList as [])
    // 注册路由
    routerMatch(menuList, roleRoutes)
    isRouteRegistered.value = true
    closeLoading()
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    throw error
  }
}

export function initRouter(app: App<Element>) {
  app.use(router)
}
