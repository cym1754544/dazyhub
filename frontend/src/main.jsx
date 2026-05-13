import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Camera,
  GripVertical,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";
import {
  clearToken,
  deleteUser,
  fetchMe,
  fetchUsers,
  getEmailConfig,
  getToken,
  login,
  register,
  resetUserPassword,
  sendCode,
  setToken,
  updateEmailConfig,
  updateProfile,
  updateSettings,
  updateUser,
  uploadAvatar,
} from "./api";
import "./styles.css";

const initialGroups = [
  { id: "work", name: "常用入口", color: "#f0a45e" },
  { id: "dev", name: "AI 与开发", color: "#31485a" },
  { id: "home", name: "效率工具", color: "#5fa87b" },
  { id: "media", name: "影音娱乐", color: "#dc7d76" },
  { id: "learn", name: "学习资料", color: "#bd8736" },
];

const starterSites = [
  { id: "work-baidu", group: "work", name: "百度", url: "baidu.com" },
  { id: "work-bilibili", group: "work", name: "Bilibili", url: "bilibili.com" },
  { id: "work-zhihu", group: "work", name: "知乎", url: "zhihu.com" },
  { id: "work-weibo", group: "work", name: "微博", url: "weibo.com" },
  { id: "work-xiaohongshu", group: "work", name: "小红书", url: "xiaohongshu.com" },
  { id: "work-taobao", group: "work", name: "淘宝", url: "taobao.com" },
  { id: "work-jd", group: "work", name: "京东", url: "jd.com" },
  { id: "work-douban", group: "work", name: "豆瓣", url: "douban.com" },
  { id: "work-amap", group: "work", name: "高德地图", url: "amap.com" },
  { id: "work-docsqq", group: "work", name: "腾讯文档", url: "docs.qq.com" },
  { id: "work-yuque", group: "work", name: "语雀", url: "yuque.com" },
  { id: "work-feishu", group: "work", name: "飞书", url: "feishu.cn" },
  { id: "dev-chatgpt", group: "dev", name: "ChatGPT", url: "chatgpt.com" },
  { id: "dev-github", group: "dev", name: "GitHub", url: "github.com" },
  { id: "dev-gitee", group: "dev", name: "Gitee", url: "gitee.com" },
  { id: "dev-vercel", group: "dev", name: "Vercel", url: "vercel.com" },
  { id: "dev-cloudflare", group: "dev", name: "Cloudflare", url: "cloudflare.com" },
  { id: "dev-docker", group: "dev", name: "Docker Hub", url: "hub.docker.com" },
  { id: "dev-npm", group: "dev", name: "npm", url: "npmjs.com" },
  { id: "dev-stackoverflow", group: "dev", name: "Stack Overflow", url: "stackoverflow.com" },
  { id: "dev-mdn", group: "dev", name: "MDN", url: "developer.mozilla.org" },
  { id: "dev-openai", group: "dev", name: "OpenAI", url: "openai.com" },
  { id: "dev-deepseek", group: "dev", name: "DeepSeek", url: "deepseek.com" },
  { id: "dev-tongyi", group: "dev", name: "通义千问", url: "tongyi.aliyun.com" },
  { id: "home-notion", group: "home", name: "Notion", url: "notion.so" },
  { id: "home-drive", group: "home", name: "Google Drive", url: "drive.google.com" },
  { id: "home-pan", group: "home", name: "百度网盘", url: "pan.baidu.com" },
  { id: "home-alipan", group: "home", name: "阿里云盘", url: "alipan.com" },
  { id: "home-shimo", group: "home", name: "石墨文档", url: "shimo.im" },
  { id: "home-canva", group: "home", name: "Canva", url: "canva.com" },
  { id: "home-figma", group: "home", name: "Figma", url: "figma.com" },
  { id: "home-processon", group: "home", name: "ProcessOn", url: "processon.com" },
  { id: "home-deepl", group: "home", name: "DeepL", url: "deepl.com" },
  { id: "home-translate", group: "home", name: "Google 翻译", url: "translate.google.com" },
  { id: "home-dida", group: "home", name: "滴答清单", url: "dida365.com" },
  { id: "home-iflyrec", group: "home", name: "讯飞听见", url: "iflyrec.com" },
  { id: "media-youtube", group: "media", name: "YouTube", url: "youtube.com" },
  { id: "media-netflix", group: "media", name: "Netflix", url: "netflix.com" },
  { id: "media-iqiyi", group: "media", name: "爱奇艺", url: "iqiyi.com" },
  { id: "media-qqvideo", group: "media", name: "腾讯视频", url: "v.qq.com" },
  { id: "media-youku", group: "media", name: "优酷", url: "youku.com" },
  { id: "media-netease", group: "media", name: "网易云音乐", url: "music.163.com" },
  { id: "media-qqmusic", group: "media", name: "QQ 音乐", url: "y.qq.com" },
  { id: "media-spotify", group: "media", name: "Spotify", url: "spotify.com" },
  { id: "media-doubanmovie", group: "media", name: "豆瓣电影", url: "movie.douban.com" },
  { id: "media-bangumi", group: "media", name: "Bangumi", url: "bgm.tv" },
  { id: "media-acfun", group: "media", name: "AcFun", url: "acfun.cn" },
  { id: "media-huya", group: "media", name: "虎牙直播", url: "huya.com" },
  { id: "learn-mooc", group: "learn", name: "中国大学 MOOC", url: "icourse163.org" },
  { id: "learn-coursera", group: "learn", name: "Coursera", url: "coursera.org" },
  { id: "learn-khan", group: "learn", name: "Khan Academy", url: "khanacademy.org" },
  { id: "learn-runoob", group: "learn", name: "菜鸟教程", url: "runoob.com" },
  { id: "learn-juejin", group: "learn", name: "掘金", url: "juejin.cn" },
  { id: "learn-sspai", group: "learn", name: "少数派", url: "sspai.com" },
  { id: "learn-ruanyifeng", group: "learn", name: "阮一峰博客", url: "ruanyifeng.com" },
  { id: "learn-leetcode", group: "learn", name: "LeetCode", url: "leetcode.cn" },
  { id: "learn-w3schools", group: "learn", name: "W3Schools", url: "w3schools.com" },
  { id: "learn-freecodecamp", group: "learn", name: "freeCodeCamp", url: "freecodecamp.org" },
  { id: "learn-wiki", group: "learn", name: "维基百科", url: "wikipedia.org" },
  { id: "learn-gitbook", group: "learn", name: "GitBook", url: "gitbook.com" },
];

const starterShortcuts = [
  { id: "quick-baidu", group: "ungrouped", name: "百度", url: "baidu.com" },
  { id: "quick-bilibili", group: "ungrouped", name: "Bilibili", url: "bilibili.com" },
  { id: "quick-github", group: "ungrouped", name: "GitHub", url: "github.com" },
  { id: "quick-chatgpt", group: "ungrouped", name: "ChatGPT", url: "chatgpt.com" },
  { id: "quick-youtube", group: "ungrouped", name: "YouTube", url: "youtube.com" },
  { id: "quick-zhihu", group: "ungrouped", name: "知乎", url: "zhihu.com" },
  { id: "quick-weibo", group: "ungrouped", name: "微博", url: "weibo.com" },
  { id: "quick-music", group: "ungrouped", name: "网易云音乐", url: "music.163.com" },
  { id: "quick-taobao", group: "ungrouped", name: "淘宝", url: "taobao.com" },
  { id: "quick-jd", group: "ungrouped", name: "京东", url: "jd.com" },
  { id: "quick-notion", group: "ungrouped", name: "Notion", url: "notion.so" },
  { id: "quick-juejin", group: "ungrouped", name: "掘金", url: "juejin.cn" },
];

const themes = [
  { id: "white", name: "纯白", colors: ["#f9fafb", "#d1d5db", "#9ca3af"] },
  { id: "warm", name: "暖白", colors: ["#fff9ed", "#2f7890", "#5fa87b"] },
  { id: "graphite", name: "石墨", colors: ["#f8f6f1", "#4b5d5b", "#b18a5b"] },
  { id: "sage", name: "松石", colors: ["#fbfbf4", "#387562", "#c79658"] },
  { id: "navy", name: "海蓝", colors: ["#faf8f0", "#2d6486", "#d39a58"] },
  { id: "rose", name: "玫瑰", colors: ["#fff9f2", "#a75b64", "#c9915c"] },
];

const searchEngines = [
  {
    id: "google",
    name: "Google",
    iconUrl: "https://www.google.com/s2/favicons?domain=google.com&sz=64",
    searchUrl: (value) => `https://www.google.com/search?q=${encodeURIComponent(value)}`,
  },
  {
    id: "baidu",
    name: "Baidu",
    iconUrl: "https://www.google.com/s2/favicons?domain=baidu.com&sz=64",
    searchUrl: (value) => `https://www.baidu.com/s?wd=${encodeURIComponent(value)}`,
  },
  {
    id: "bing",
    name: "Bing",
    iconUrl: "https://www.google.com/s2/favicons?domain=bing.com&sz=64",
    searchUrl: (value) => `https://www.bing.com/search?q=${encodeURIComponent(value)}`,
  },
];

function normalizedUrl(value) {
  return value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function favicon(url) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(normalizedUrl(url))}&sz=64`;
}

function faviconSources(url, customIconUrl = "") {
  if (customIconUrl) return [customIconUrl];

  const domain = normalizedUrl(url);
  const sources = [
    `https://${domain}/favicon.ico`,
    ...(domain.startsWith("www.") ? [] : [`https://www.${domain}/favicon.ico`]),
    favicon(domain),
  ];

  return [...new Set(sources)];
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function moveItem(items, draggedId, targetGroup, targetId) {
  if (!targetId || draggedId === targetId) return items;

  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId && item.group === targetGroup);

  if (draggedIndex === -1 || targetIndex === -1) return items;

  const next = [...items];
  const [dragged] = next.splice(draggedIndex, 1);
  next.splice(targetIndex, 0, { ...dragged, group: targetGroup });
  return next;
}

const DRAG_REORDER_COOLDOWN_MS = 240;

function App() {
  const [sites, setSites] = useState([...starterShortcuts, ...starterSites]);
  const [siteGroups, setSiteGroups] = useState(initialGroups);
  const [ungroupedName, setUngroupedName] = useState("未分组");
  const [activeGroup, setActiveGroup] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [addSiteGroup, setAddSiteGroup] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [tagSize, setTagSize] = useState("short");
  const [theme, setTheme] = useState("warm");
  const [searchEngineId, setSearchEngineId] = useState("google");
  const [toast, setToast] = useState(null);
  const [isSearchEngineOpen, setIsSearchEngineOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const cardRectsRef = useRef(new Map());
  const lastDragMoveRef = useRef({ targetId: null, movedAt: 0 });
  const lastReorderRef = useRef({ at: 0, targetId: null });

  const applyUserSettings = (user) => {
    if (user.tagSize) setTagSize(user.tagSize);
    if (user.theme) setTheme(user.theme);
    if (user.searchEngine) setSearchEngineId(user.searchEngine);
  };

  const persistSettings = async (payload) => {
    if (!currentUser) return;

    try {
      const updatedUser = await updateSettings(payload);
      setCurrentUser(updatedUser);
      applyUserSettings(updatedUser);
    } catch (error) {
      // Keep the UI responsive; a later refresh will restore the saved user settings.
    }
  };

  useEffect(() => {
    if (!getToken()) return;

    fetchMe()
      .then((user) => {
        setCurrentUser(user);
        applyUserSettings(user);
      })
      .catch((error) => {
        if (error.status === 401) {
          clearToken();
        }
      });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(timer);
  }, [toast]);

  useLayoutEffect(() => {
    const cards = document.querySelectorAll("[data-site-id]");
    const previousRects = cardRectsRef.current;
    const nextRects = new Map();

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const previous = previousRects.get(card.dataset.siteId);
      nextRects.set(card.dataset.siteId, rect);

      if (!previous) return;

      const deltaX = previous.left - rect.left;
      const deltaY = previous.top - rect.top;

      if (!deltaX && !deltaY) return;

      card.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 340,
          easing: "cubic-bezier(.22, 1, .36, 1)",
        },
      );
    });

    cardRectsRef.current = nextRects;
  }, [sites]);

  const filteredSections = useMemo(() => {
    const allGroups = [{ id: "ungrouped", name: ungroupedName, color: "#2f7890" }, ...siteGroups];

    return allGroups
      .map((group) => {
        const items = sites.filter((site) => {
          const inGroup = site.group === group.id;
          const inActiveGroup = activeGroup === "all" || site.group === activeGroup;
          return inGroup && inActiveGroup;
        });

        return { ...group, items };
      })
      .filter((section) => section.items.length > 0 || isEditing);
  }, [activeGroup, isEditing, siteGroups, sites, ungroupedName]);

  const groupCounts = useMemo(() => {
    return siteGroups.reduce((counts, group) => {
      counts[group.id] = sites.filter((site) => site.group === group.id).length;
      return counts;
    }, {});
  }, [siteGroups, sites]);

  const selectedSearchEngine = searchEngines.find((engine) => engine.id === searchEngineId) || searchEngines[0];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextQuery = searchQuery.trim();

    if (!nextQuery) return;

    window.open(selectedSearchEngine.searchUrl(nextQuery), "_blank", "noreferrer");
  };

  const handleDragStart = (event, site) => {
    if (!isEditing) {
      event.preventDefault();
      return;
    }

    const dragPreview = event.currentTarget.cloneNode(true);
    const rect = event.currentTarget.getBoundingClientRect();
    dragPreview.classList.add("drag-preview");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, event.clientX - rect.left, event.clientY - rect.top);
    window.setTimeout(() => dragPreview.remove(), 0);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", site.id);
    lastDragMoveRef.current = { targetId: null, movedAt: 0 };
    setDragState({ draggedId: site.id, overGroup: site.group, overId: site.id });
  };

  const handleDragOver = (event, targetGroup, targetId = null) => {
    if (!isEditing) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    setDragState((current) => {
      const draggedId = current?.draggedId;
      const now = performance.now();
      const lastMove = lastDragMoveRef.current;
      const canReorder = now - lastMove.movedAt > 220;

      if (draggedId && targetId && draggedId !== targetId && current?.overId !== targetId && canReorder) {
        setSites((currentSites) => moveItem(currentSites, draggedId, targetGroup, targetId));
        lastDragMoveRef.current = { targetId, movedAt: now };
      }

      return {
        draggedId,
        overGroup: targetGroup,
        overId: targetId,
      };
    });
  };

  const handleDrop = (event, targetGroup, targetId = null) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain") || dragState?.draggedId;

    if (!draggedId) {
      lastDragMoveRef.current = { targetId: null, movedAt: 0 };
      setDragState(null);
      return;
    }

    if (!targetId) {
      setSites((currentSites) => currentSites.map((site) => (
        site.id === draggedId ? { ...site, group: targetGroup } : site
      )));
    }
    lastDragMoveRef.current = { targetId: null, movedAt: 0 };
    setDragState(null);
  };

  const handleDragEnd = () => {
    lastDragMoveRef.current = { targetId: null, movedAt: 0 };
    setDragState(null);
  };

  const handleSave = () => {
    setIsEditing(false);
    setDragState(null);
    lastDragMoveRef.current = { targetId: null, movedAt: 0 };
  };

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setCurrentUser(data.user);
    applyUserSettings(data.user);
    setAuthMode(null);
    setToast(authMode === "login" ? "登录成功" : "注册成功");
  };

  const handleTagSizeChange = (nextTagSize) => {
    setTagSize(nextTagSize);
    persistSettings({ tagSize: nextTagSize });
  };

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme);
    persistSettings({ theme: nextTheme });
  };

  const handleSearchEngineChange = (nextSearchEngineId) => {
    setSearchEngineId(nextSearchEngineId);
    persistSettings({ searchEngine: nextSearchEngineId });
  };

  const handleAddSite = (site) => {
    setSites((currentSites) => {
      const nextSite = {
        ...site,
        id: `site-${Date.now()}`,
        group: site.group || "ungrouped",
      };
      const insertAfter = currentSites.reduce((lastIndex, currentSite, index) => (
        currentSite.group === nextSite.group ? index : lastIndex
      ), -1);
      const nextSites = [...currentSites];
      nextSites.splice(insertAfter + 1, 0, nextSite);
      return nextSites;
    });
    setActiveGroup(site.group || "all");
    setAddSiteGroup(null);
    setToast("网站已添加");
  };

  const handleUpdateSite = (updatedSite) => {
    setSites((currentSites) => currentSites.map((site) => (
      site.id === updatedSite.id ? { ...site, ...updatedSite } : site
    )));
    setEditingSite(null);
    setToast("网站已更新");
  };

  const handleDeleteSite = (siteId) => {
    setSites((currentSites) => currentSites.filter((site) => site.id !== siteId));
    setToast("网站已删除");
  };

  const handleRenameGroup = ({ id, name, color }) => {
    if (id === "ungrouped") {
      setUngroupedName(name);
    } else {
      setSiteGroups((currentGroups) => currentGroups.map((group) => (
        group.id === id ? { ...group, name, color: color || group.color } : group
      )));
    }
    setEditingGroup(null);
    setToast("分组已更新");
  };

  const totalSites = sites.length;

  return (
    <div className="app" data-theme={theme}>
      {toast && (
        <div className="success-toast">
          <div className="toast-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 12 9 17 20 6" />
            </svg>
          </div>
          <span className="toast-label">{toast}</span>
        </div>
      )}
      {isAdminOpen && currentUser?.role === "admin" ? (
        <AdminPage onClose={() => setIsAdminOpen(false)} onSuccess={setToast} />
      ) : (
        <>
          <aside className="sidebar">
            <button
              className={`brand ${currentUser ? "is-signed-in" : ""}`}
              type="button"
              onClick={() => (currentUser ? setIsProfileOpen(true) : setAuthMode("login"))}
            >
              {currentUser ? <Avatar user={currentUser} size="brand" /> : <div className="brand-mark guest"><img src="/wenhao.jpeg" alt="" /></div>}
              <div className="brand-name">
                <strong>{currentUser ? currentUser.displayName : "登录"}</strong>
                {currentUser && <span>{currentUser.signature || (currentUser.email || "").split("@")[0]}</span>}
              </div>
            </button>

            <div>
              <div className="nav-section-title">分组</div>
              <nav className="group-list" aria-label="网站分组">
                <button
                  className={`group-button ${activeGroup === "all" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveGroup("all")}
                >
                  <span><i className="group-dot" style={{ background: "#2f7890" }} />全部</span>
                  <span className="group-count">{totalSites}</span>
                </button>
                {siteGroups.map((group) => (
                  <div className="group-row" key={group.id}>
                    <button
                      className={`group-button ${activeGroup === group.id ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setActiveGroup(group.id)}
                    >
                      <span><i className="group-dot" style={{ background: group.color }} />{group.name}</span>
                      <span className="group-count">{groupCounts[group.id]}</span>
                    </button>
                    <button
                      className="group-edit"
                      type="button"
                      title={`编辑${group.name}`}
                      aria-label={`编辑${group.name}`}
                      onClick={() => setEditingGroup(group)}
                    >
                      <Pencil />
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            <div className="sidebar-bottom">
              <div className="sidebar-card">
                <strong>收藏概览</strong>
                <div className="mini-row"><span>网站</span><b>{sites.length}</b></div>
                <div className="mini-row"><span>分组</span><b>{siteGroups.length}</b></div>
                <div className="mini-row"><span>模式</span><b>{isEditing ? "编辑" : "浏览"}</b></div>
              </div>
              {currentUser?.role === "admin" && (
                <button
                  className={`action-button wide admin-button${isAdminOpen ? " is-active" : ""}`}
                  type="button"
                  onClick={() => setIsAdminOpen((v) => !v)}
                >
                  <Shield />
                  <span>{isAdminOpen ? "返回首页" : "后台管理"}</span>
                </button>
              )}
            </div>

          </aside>

          <main className="main">
            <header className="topbar">

              <form className="search" onSubmit={handleSearchSubmit}>
            <div
              className="search-engine-picker"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsSearchEngineOpen(false);
                }
              }}
            >
              <button
                className={`search-engine-trigger ${isSearchEngineOpen ? "is-active" : ""}`}
                type="button"
                aria-label={`当前搜索引擎：${selectedSearchEngine.name}`}
                aria-expanded={isSearchEngineOpen}
                onClick={() => setIsSearchEngineOpen((open) => !open)}
              >
                <img src={selectedSearchEngine.iconUrl} alt="" aria-hidden="true" />
                <ChevronDown />
              </button>
              {isSearchEngineOpen && (
                <div className="search-engine-menu" role="listbox" aria-label="搜索引擎">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.id}
                      className={`search-engine-menu-item ${searchEngineId === engine.id ? "is-active" : ""}`}
                      type="button"
                      role="option"
                      aria-selected={searchEngineId === engine.id}
                      aria-label={engine.name}
                      title={engine.name}
                      onClick={() => {
                        handleSearchEngineChange(engine.id);
                        setIsSearchEngineOpen(false);
                      }}
                    >
                      <img src={engine.iconUrl} alt="" aria-hidden="true" />
                      <span>{engine.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="输入搜索内容"
            />
            <button className="search-submit" type="submit">
              <Search />
              <span>搜索</span>
            </button>
          </form>
          <div className="toolbar" aria-label="页面工具">
            <button
              className={`icon-button ${isSettingsOpen ? "is-active" : ""}`}
              type="button"
              title="设置"
              aria-label="设置"
              onClick={() => setIsSettingsOpen((open) => !open)}
            >
              <Settings />
            </button>
            <button
              className={`icon-button ${isEditing ? "is-active" : ""}`}
              type="button"
              title={isEditing ? "保存" : "编辑"}
              aria-label={isEditing ? "保存" : "编辑"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? <Save /> : <Pencil />}
            </button>

          </div>
        </header>

        <div className={`content ${isEditing ? "is-editing" : ""}`}>
          {filteredSections.map((section) => (
            <SiteSection
              key={section.id}
              section={section}
              isEditing={isEditing}
              tagSize={tagSize}
              dragState={dragState}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onAddSite={(groupId) => setAddSiteGroup(groupId)}
              onRenameGroup={handleRenameGroup}
              onEditSite={setEditingSite}
              onDeleteSite={handleDeleteSite}
            />
          ))}
        </div>
          </main>
        </>
      )}
      {authMode && (
        <AuthDialog
          mode={authMode}
          loading={authLoading}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
          onSubmit={async (payload) => {
            setAuthLoading(true);
            try {
              const data = authMode === "login" ? await login(payload) : await register(payload);
              handleAuthSuccess(data);
            } finally {
              setAuthLoading(false);
            }
          }}
        />
      )}
      {isProfileOpen && currentUser && (
        <ProfileDialog
          user={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onUserChange={setCurrentUser}
          onSuccess={setToast}
        />
      )}
      {addSiteGroup && (
        <AddSiteDialog
          groups={siteGroups}
          initialGroup={addSiteGroup}
          onClose={() => setAddSiteGroup(null)}
          onSubmit={handleAddSite}
        />
      )}
      {editingSite && (
        <SiteEditorDialog
          groups={siteGroups}
          site={editingSite}
          mode="edit"
          onClose={() => setEditingSite(null)}
          onSubmit={handleUpdateSite}
        />
      )}
      {editingGroup && (
        <GroupEditorDialog
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSubmit={handleRenameGroup}
        />
      )}
      {isSettingsOpen && (
        <div className="settings-backdrop" role="presentation" onMouseDown={() => setIsSettingsOpen(false)}>
          <div className="settings-popover" role="dialog" aria-modal="true" aria-label="设置" onMouseDown={(event) => event.stopPropagation()}>
            <div className="settings-header">
              <strong>设置</strong>
              <button className="icon-button" type="button" aria-label="关闭设置" onClick={() => setIsSettingsOpen(false)}>
                <X />
              </button>
            </div>
            <label className="setting-row">
              <span>标签大小</span>
              <select value={tagSize} onChange={(event) => handleTagSizeChange(event.target.value)}>
                <option value="short">短</option>
                <option value="long">长</option>
              </select>
            </label>
            <div className="setting-row">
              <span>主题模式</span>
              <div className="theme-options" role="radiogroup" aria-label="主题模式">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    className={`theme-option ${theme === themeOption.id ? "is-active" : ""}`}
                    type="button"
                    role="radio"
                    aria-checked={theme === themeOption.id}
                    aria-label={themeOption.name}
                    title={themeOption.name}
                    onClick={() => handleThemeChange(themeOption.id)}
                    data-name={themeOption.name}
                  >
                    <span style={{ background: themeOption.colors[1] }} />
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <span>搜索引擎</span>
              <div className="engine-options" role="radiogroup" aria-label="搜索引擎">
                {searchEngines.map((engine) => (
                  <button
                    key={engine.id}
                    className={`engine-option ${searchEngineId === engine.id ? "is-active" : ""}`}
                    type="button"
                    role="radio"
                    aria-checked={searchEngineId === engine.id}
                    aria-label={engine.name}
                    title={engine.name}
                    onClick={() => handleSearchEngineChange(engine.id)}
                  >
                    <img src={engine.iconUrl} alt="" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
            {currentUser && (
              <button
                className="setting-row logout-button"
                type="button"
                onClick={() => { clearToken(); setCurrentUser(null); setIsSettingsOpen(false); }}
              >
                <LogOut />
                <span>登出</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({ user, size = "normal" }) {
  if (user.avatarUrl) {
    return <img className={`avatar ${size}`} src={user.avatarUrl} alt={`${user.displayName} 头像`} />;
  }

  return (
    <span className={`avatar fallback ${size}`} aria-hidden="true">
      {(user.displayName || (user.email || "").split("@")[0] || "D").slice(0, 1).toUpperCase()}
    </span>
  );
}

function SiteIcon({ site }) {
  const sources = useMemo(() => faviconSources(site.url, site.iconUrl), [site.iconUrl, site.url]);
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [sources]);

  return (
    <img
      className="site-icon"
      src={sources[sourceIndex]}
      alt={`${site.name} 图标`}
      loading="lazy"
      onError={() => setSourceIndex((index) => Math.min(index + 1, sources.length - 1))}
    />
  );
}

function AuthDialog({ mode, loading, onModeChange, onClose, onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", displayName: "", code: "" });
  const [error, setError] = useState("");
  const [codeCooldown, setCodeCooldown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const isRegister = mode === "register";

  useEffect(() => {
    if (codeCooldown <= 0) return;
    const timer = setTimeout(() => setCodeCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [codeCooldown]);

  const handleSendCode = async () => {
    if (codeCooldown > 0 || sendingCode) return;
    setError("");
    setSendingCode(true);
    try {
      await sendCode(form.email.trim().toLowerCase());
      setCodeCooldown(60);
    } catch (e) {
      setError(e.message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (isRegister && !form.code) {
      setError("请输入验证码");
      return;
    }
    try {
      await onSubmit(form);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal auth-modal" onSubmit={handleSubmit} autoComplete="off">
        <input type="email" autoComplete="email" style={{display:"none"}} tabIndex={-1} readOnly />
        <input type="password" autoComplete="current-password" style={{display:"none"}} tabIndex={-1} readOnly />
        <div className="modal-header">
          <div>
            <p className="eyebrow">DazyHub Account</p>
            <h2>{isRegister ? "注册账号" : "登录账号"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div className="segmented">
          <button className={!isRegister ? "is-active" : ""} type="button" onClick={() => onModeChange("login")}>登录</button>
          <button className={isRegister ? "is-active" : ""} type="button" onClick={() => onModeChange("register")}>注册</button>
        </div>

        <label className="field">
          <span>邮箱</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            type="email"
            autoFocus
            required
            maxLength={128}
            placeholder="请输入邮箱"
          />
        </label>
        {isRegister && (
          <label className="field">
            <span>昵称</span>
            <input
              value={form.displayName}
              onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              maxLength={80}
              placeholder="请输入昵称"
            />
          </label>
        )}
        <label className="field">
          <span>密码</span>
          <input
            value={form.password}
            autoComplete={isRegister ? "new-password" : "current-password"}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            type="password"
            required
            minLength={6}
            maxLength={120}
            placeholder="请输入密码"
          />
        </label>
        {isRegister && (
          <>
            <label className="field">
              <span>确认密码</span>
              <input
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                maxLength={120}
                placeholder="请再次输入密码"
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <span className="field-hint">两次输入的密码不符</span>
              )}
            </label>
            <label className="field">
              <span>验证码</span>
              <div className="code-row">
                <input
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value })}
                  required
                  maxLength={6}
                  placeholder="请输入验证码"
                />
                <button
                  type="button"
                  className="send-code-button"
                  disabled={codeCooldown > 0 || sendingCode}
                  onClick={handleSendCode}
                >
                  {sendingCode ? "发送中..." : codeCooldown > 0 ? `${codeCooldown}s` : "发送验证码"}
                </button>
              </div>
            </label>
          </>
        )}

        {!isRegister && (
          <button type="button" className="forgot-password" onClick={() => setError("请联系管理员重置密码")}>
            忘记密码？
          </button>
        )}
        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit" disabled={loading}>
          <LogIn />
          <span>{loading ? "处理中..." : isRegister ? "注册并登录" : "登录"}</span>
        </button>
      </form>
    </div>
  );
}

function ProfileDialog({ user, onClose, onUserChange, onSuccess }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [signature, setSignature] = useState(user.signature || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cropFile, setCropFile] = useState(null);
  const fileInputRef = useRef(null);

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const updated = await updateProfile({ displayName, signature });
      onUserChange(updated);
      onSuccess("资料已保存");
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    event.target.value = "";
  };

  const handleCropConfirm = async (blob) => {
    setCropFile(null);
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = await uploadAvatar(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      onUserChange({ ...user, displayName, signature, avatarUrl: result.avatarUrl });
      onSuccess("头像已更新");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal profile-modal" onSubmit={saveProfile}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h2>个人设置</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div className="avatar-editor-v2">
          <div className="avatar-clickable" onClick={handleAvatarClick} title="点击上传头像" style={{ borderRadius: "50%", overflow: "hidden", display: "inline-block" }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", overflow: "hidden" }}>
              <Avatar user={{ ...user, displayName, signature }} size="large" />
            </div>
            <span className="avatar-overlay">
              <Camera />
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            hidden
          />
        </div>

        <label className="field">
          <span>邮箱</span>
          <input value={user.email} disabled />
        </label>
        <label className="field">
          <span>昵称</span>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required maxLength={80} />
        </label>
        <label className="field">
          <span>个性签名</span>
          <input
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
            maxLength={120}
            placeholder="显示在昵称下方"
          />
        </label>

        {error && <div className="form-error">{error}</div>}
        {message && <div className="form-success">{message}</div>}

        <button className="action-button wide" type="submit" disabled={loading}>
          <Save />
          <span>{loading ? "保存中..." : "保存资料"}</span>
        </button>
      </form>

      {cropFile && (
        <CropDialog
          file={cropFile}
          onClose={() => setCropFile(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}

function CropDialog({ file, onClose, onConfirm }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const baseRef = useRef({ w: 0, h: 0, scale: 1 });
  const viewportSize = 240;

  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const displayW = baseRef.current.w * zoom;
  const displayH = baseRef.current.h * zoom;
  const maxOffsetX = Math.max(0, displayW - viewportSize);
  const maxOffsetY = Math.max(0, displayH - viewportSize);

  const clampOffset = (ox, oy) => ({
    x: Math.max(-maxOffsetX, Math.min(0, ox)),
    y: Math.max(-maxOffsetY, Math.min(0, oy)),
  });

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    lastPosRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    const dx = event.clientX - lastPosRef.current.x;
    const dy = event.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: event.clientX, y: event.clientY };
    setOffset((prev) => clampOffset(prev.x + dx, prev.y + dy));
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleImageLoad = (event) => {
    const img = event.target;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const baseScale = Math.max(viewportSize / naturalW, viewportSize / naturalH);
    const dw = naturalW * baseScale;
    const dh = naturalH * baseScale;

    baseRef.current = { w: dw, h: dh, scale: baseScale };
    setZoom(1);
    setOffset({ x: (dw - viewportSize) / -2, y: (dh - viewportSize) / -2 });
    setImageLoaded(true);
  };

  const handleZoomChange = (nextZoom) => {
    const prevCenterX = Math.abs(offset.x) + viewportSize / 2;
    const prevCenterY = Math.abs(offset.y) + viewportSize / 2;
    const ratio = nextZoom / zoom;
    const newCenterX = prevCenterX * ratio;
    const newCenterY = prevCenterY * ratio;
    setZoom(nextZoom);
    setOffset(clampOffset(-(newCenterX - viewportSize / 2), -(newCenterY - viewportSize / 2)));
  };

  const handleConfirm = () => {
    setLoading(true);
    const canvas = document.createElement("canvas");
    canvas.width = viewportSize;
    canvas.height = viewportSize;
    const ctx = canvas.getContext("2d");

    const effectiveScale = baseRef.current.scale * zoom;

    ctx.beginPath();
    ctx.arc(viewportSize / 2, viewportSize / 2, viewportSize / 2, 0, Math.PI * 2);
    ctx.clip();

    const sx = Math.abs(offset.x) / effectiveScale;
    const sy = Math.abs(offset.y) / effectiveScale;
    const sw = viewportSize / effectiveScale;
    const sh = viewportSize / effectiveScale;

    ctx.drawImage(imageRef.current, sx, sy, sw, sh, 0, 0, viewportSize, viewportSize);

    canvas.toBlob(
      (blob) => {
        setLoading(false);
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="modal-backdrop crop-backdrop" role="presentation" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="crop-dialog">
        <div className="crop-header">
          <h3>裁剪头像</h3>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div
          className="crop-viewport"
          style={{ width: viewportSize, height: viewportSize }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <img
            ref={imageRef}
            className="crop-image"
            src={objectUrl}
            alt="裁剪预览"
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              width: displayW || "auto",
              height: displayH || "auto",
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              opacity: imageLoaded ? 1 : 0,
            }}
          />
          <div className="crop-mask" />
        </div>

        <div className="crop-zoom">
          <span>缩放</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          />
          <span>{zoom.toFixed(2)}x</span>
        </div>

        <p className="crop-hint">拖拽图片调整位置</p>

        <div className="crop-actions">
          <button className="action-button wide" type="button" onClick={onClose}>取消</button>
          <button className="action-button wide primary" type="button" disabled={loading || !imageLoaded} onClick={handleConfirm}>
            {loading ? "处理中..." : "确认"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddSiteDialog({ groups: siteGroups, initialGroup, onClose, onSubmit }) {
  return (
    <SiteEditorDialog
      groups={siteGroups}
      initialGroup={initialGroup}
      mode="add"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function SiteEditorDialog({ groups: siteGroups, initialGroup = "ungrouped", mode, site = null, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: site?.name || "",
    url: site?.url || "",
    group: site?.group || initialGroup,
    iconUrl: site?.iconUrl || "",
  });
  const [error, setError] = useState("");
  const allGroups = [{ id: "ungrouped", name: "未分组" }, ...siteGroups];
  const detectedIcon = form.url ? favicon(form.url) : "";
  const previewIcon = form.iconUrl || detectedIcon;
  const isEdit = mode === "edit";

  const detectSite = () => {
    const nextUrl = normalizedUrl(form.url);

    if (!nextUrl) {
      setError("请先输入网址");
      return;
    }

    try {
      const parsed = new URL(/^https?:\/\//i.test(form.url) ? form.url : `https://${nextUrl}`);
      const host = parsed.hostname.replace(/^www\./i, "");
      const readableName = host.split(".")[0]
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

      setForm((current) => ({
        ...current,
        name: current.name || readableName,
        url: host + parsed.pathname.replace(/\/$/, ""),
      }));
      setError("");
    } catch {
      setError("网址格式看起来不太对");
    }
  };

  const handleIconUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, iconUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUrl = normalizedUrl(form.url);

    if (!nextUrl) {
      setError("请输入网址");
      return;
    }

    onSubmit({
      id: site?.id,
      name: form.name.trim() || nextUrl.replace(/^www\./i, "").split(".")[0],
      url: nextUrl,
      group: form.group,
      iconUrl: form.iconUrl,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal add-site-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{isEdit ? "Edit Shortcut" : "New Shortcut"}</p>
            <h2>{isEdit ? "编辑网站" : "添加网站"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div className="site-icon-editor">
          <div className="site-icon-preview">
            {previewIcon ? <img src={previewIcon} alt="网站图标预览" /> : <Plus />}
          </div>
          <label className="avatar-upload">
            <Camera />
            <span>上传图标</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleIconUpload} />
          </label>
        </div>

        <label className="field">
          <span>网址</span>
          <div className="input-with-action">
            <input
              value={form.url}
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              onBlur={detectSite}
              autoFocus
              required
              placeholder="example.com"
            />
            <button className="icon-button" type="button" onClick={detectSite} title="自动识别" aria-label="自动识别">
              <Sparkles />
            </button>
          </div>
        </label>

        <label className="field">
          <span>网站名称</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            maxLength={80}
            placeholder="自动识别或手动输入"
          />
        </label>

        <label className="field">
          <span>分组</span>
          <select value={form.group} onChange={(event) => setForm({ ...form, group: event.target.value })}>
            {allGroups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit">
          {isEdit ? <Save /> : <Plus />}
          <span>{isEdit ? "保存网站" : "添加到首页"}</span>
        </button>
      </form>
    </div>
  );
}

function GroupEditorDialog({ group, onClose, onSubmit }) {
  const [name, setName] = useState(group.name);
  const [color, setColor] = useState(group.color || "#5fa87b");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      setError("请输入分组名称");
      return;
    }

    onSubmit({ id: group.id, name: nextName, color });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal group-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Group</p>
            <h2>编辑分组</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <label className="field">
          <span>分组名称</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            maxLength={24}
            required
            placeholder="请输入分组名称"
          />
        </label>

        <label className="field">
          <span>分组颜色</span>
          <div className="color-picker-row">
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <span className="color-hex">{color}</span>
          </div>
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit">
          <Save />
          <span>保存分组</span>
        </button>
      </form>
    </div>
  );
}

function SiteSection({
  section,
  isEditing,
  tagSize,
  dragState,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onAddSite,
  onRenameGroup,
  onEditSite,
  onDeleteSite,
}) {
  const cardClass = tagSize === "short" ? "shortcut-card" : "site-card";
  const gridClass = tagSize === "short" ? "tag-grid tag-grid-short" : "tag-grid tag-grid-long";
  const [groupName, setGroupName] = useState(section.name);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const titleInputWidth = `${Math.max(4.5, Math.min(Array.from(groupName).length + 1.5, 24))}em`;

  useEffect(() => {
    setGroupName(section.name);
    setIsEditingGroupName(false);
  }, [section.name]);

  const commitGroupName = () => {
    const nextName = groupName.trim();

    if (!nextName || nextName === section.name) {
      setGroupName(section.name);
      setIsEditingGroupName(false);
      return;
    }

    setGroupName(nextName);
    onRenameGroup({ id: section.id, name: nextName });
    setIsEditingGroupName(false);
  };

  return (
    <section
      className={`group-section ${dragState?.overGroup === section.id && !dragState.overId ? "is-drop-target" : ""}`}
      onDragOver={(event) => onDragOver(event, section.id)}
      onDrop={(event) => onDrop(event, section.id)}
    >
      <div className="section-heading">
        <div className="section-title-slot">
          {isEditing && isEditingGroupName ? (
            <input
              className="section-title-edit"
              value={groupName}
              style={{ width: titleInputWidth }}
              aria-label={`编辑${section.name}分组名称`}
              maxLength={24}
              onChange={(event) => setGroupName(event.target.value)}
              onBlur={commitGroupName}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();
                  commitGroupName();
                }

                if (event.key === "Escape") {
                  event.stopPropagation();
                  setGroupName(section.name);
                  setIsEditingGroupName(false);
                }
              }}
              autoFocus
            />
          ) : isEditing ? (
            <button
              className="section-title-button"
              type="button"
              title={`编辑${section.name}分组名称`}
              aria-label={`编辑${section.name}分组名称`}
              onClick={() => setIsEditingGroupName(true)}
            >
              {section.name}
            </button>
          ) : (
            <h2>{section.name}</h2>
          )}
        </div>
      </div>
      <div className={gridClass}>
        {section.items.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            isEditing={isEditing}
            tagSize={tagSize}
            isDragging={dragState?.draggedId === site.id}
            isSwapTarget={dragState?.overId === site.id && dragState?.draggedId !== site.id}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            onEdit={onEditSite}
            onDelete={onDeleteSite}
          />
        ))}
        {isEditing && (
          <button
            className={`${cardClass} add-site-card`}
            type="button"
            title={`添加到${section.name}`}
            aria-label={`添加到${section.name}`}
            onClick={() => onAddSite(section.id)}
          >
            <Plus />
          </button>
        )}
      </div>
    </section>
  );
}

function SiteCard({
  site,
  isEditing,
  tagSize,
  isDragging,
  isSwapTarget,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
}) {
  const isShort = tagSize === "short";
  const href = /^https?:\/\//.test(site.url) ? site.url : `https://${site.url}`;
  const [contextMenu, setContextMenu] = useState(null);
  const cardRef = useRef(null);

  const stopCardAction = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleDown = (e) => {
      if (!e.target.closest(".context-menu")) closeContextMenu();
    };
    const handleScroll = () => closeContextMenu();
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [contextMenu]);

  return (
    <>
      <a
        ref={cardRef}
        className={`${isShort ? "shortcut-card" : "site-card"} ${isEditing ? "can-drag" : ""} ${isDragging ? "is-dragging" : ""} ${isSwapTarget ? "is-swap-target" : ""}`}
        data-site-id={site.id}
        href={isEditing ? undefined : href}
        target={isEditing ? undefined : "_blank"}
        rel={isEditing ? undefined : "noreferrer"}
        draggable={isEditing}
        onDragStart={(event) => onDragStart(event, site)}
        onDragOver={(event) => onDragOver(event, site.group, site.id)}
        onDragEnd={onDragEnd}
        onDrop={(event) => onDrop(event, site.group, site.id)}
        onContextMenu={handleContextMenu}
      >
        {isEditing && (
          <div className="site-card-move-indicator">
            <GripVertical />
          </div>
        )}
        <SiteIcon site={site} />
        {isShort ? (
          <strong>{site.name}</strong>
        ) : (
          <div className="site-name">
            <strong>{site.name}</strong>
            <span>{site.url}</span>
          </div>
        )}
      </a>
      {contextMenu && (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onMouseDown={stopCardAction} onClick={stopCardAction}>
          <button type="button" onClick={() => { onEdit(site); closeContextMenu(); }}>
            <Pencil /> 编辑
          </button>
          <button type="button" className="danger" onClick={() => { onDelete(site.id); closeContextMenu(); }}>
            <Trash2 /> 删除
          </button>
        </div>
      )}
    </>
  );
}

function AdminPage({ onClose, onSuccess }) {
  const tabs = [
    { id: "users", label: "用户管理", icon: <Shield /> },
    { id: "email", label: "邮件配置", icon: <Mail /> },
  ];
  const [activeTab, setActiveTab] = useState("users");

  /* ---- email config ---- */
  const [emailConfig, setEmailConfig] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (activeTab === "email") {
      setEmailLoading(true);
      getEmailConfig()
        .then(setEmailConfig)
        .catch((e) => setEmailError(e.message))
        .finally(() => setEmailLoading(false));
    }
  }, [activeTab]);

  const handleEmailSave = async (event) => {
    event.preventDefault();
    setEmailLoading(true);
    setEmailError("");
    try {
      const updated = await updateEmailConfig(emailConfig);
      setEmailConfig(updated);
      onSuccess("邮件配置已保存");
    } catch (e) {
      setEmailError(e.message);
    } finally {
      setEmailLoading(false);
    }
  };

  /* ---- user management ---- */
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ displayName: "", email: "", role: "user" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const loadUsers = (search) => {
    setUserLoading(true);
    setUserError("");
    fetchUsers(search)
      .then(setUsers)
      .catch((e) => setUserError(e.message))
      .finally(() => setUserLoading(false));
  };

  const handleUserSearch = (value) => {
    setUserSearch(value);
    loadUsers(value);
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers(userSearch);
  }, [activeTab]);

  const openEditDialog = (user) => {
    setEditingUser(user);
    setEditForm({ displayName: user.displayName, email: user.email, role: user.role });
    setEditError("");
    setResetMsg("");
  };

  const handleEditSave = async (event) => {
    event.preventDefault();
    setEditSaving(true);
    setEditError("");
    try {
      const updated = await updateUser(editingUser.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditingUser(null);
      onSuccess("用户已更新");
    } catch (e) {
      setEditError(e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`确认删除用户「${user.displayName}」(${user.email})？此操作不可撤销。`)) return;
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      onSuccess("用户已删除");
    } catch (e) {
      setUserError(e.message);
    }
  };

  const handleResetPassword = async (user) => {
    if (!window.confirm(`确认重置用户「${user.displayName}」的密码？`)) return;
    try {
      const result = await resetUserPassword(user.id);
      setResetMsg(`新密码：${result.password}`);
      onSuccess("密码已重置");
      setTimeout(() => setResetMsg(""), 10000);
    } catch (e) {
      setUserError(e.message);
    }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="brand-mark" style={{ width: 42, height: 42, fontSize: 20, borderRadius: 10 }}>D</div>
            <strong>后台管理</strong>
          </div>
        </div>
        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-nav-item${activeTab === tab.id ? " is-active" : ""}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <button className="admin-nav-item" type="button" onClick={onClose}>
            <X />
            <span>退出管理</span>
          </button>
        </div>
      </aside>
      <div className="admin-content">
        {activeTab === "email" && (
          <div className="admin-panel">
            <h2>邮件服务配置</h2>
            <p className="admin-desc">配置 SMTP 服务器信息，用于发送注册验证码等邮件</p>
            {emailLoading && !emailConfig ? (
              <p className="admin-loading">加载中...</p>
            ) : (
              <form className="admin-form" onSubmit={handleEmailSave}>
                <label className="field">
                  <span>SMTP 服务器</span>
                  <input
                    value={emailConfig?.smtpHost || ""}
                    onChange={(event) => setEmailConfig({ ...emailConfig, smtpHost: event.target.value })}
                    required
                    placeholder="smtp.qq.com"
                  />
                </label>
                <label className="field">
                  <span>SMTP 端口</span>
                  <input
                    type="number"
                    value={emailConfig?.smtpPort ?? 587}
                    onChange={(event) => setEmailConfig({ ...emailConfig, smtpPort: parseInt(event.target.value, 10) || 587 })}
                    required
                    placeholder="587"
                  />
                </label>
                <label className="field">
                  <span>邮箱账号</span>
                  <input
                    value={emailConfig?.smtpUsername || ""}
                    onChange={(event) => setEmailConfig({ ...emailConfig, smtpUsername: event.target.value })}
                    required
                    placeholder="your-email@qq.com"
                  />
                </label>
                <label className="field">
                  <span>授权码</span>
                  <input
                    type="password"
                    value={emailConfig?.smtpPassword || ""}
                    onChange={(event) => setEmailConfig({ ...emailConfig, smtpPassword: event.target.value })}
                    placeholder="留空则不修改"
                  />
                </label>
                <label className="field">
                  <span>发件人地址</span>
                  <input
                    value={emailConfig?.mailFrom || ""}
                    onChange={(event) => setEmailConfig({ ...emailConfig, mailFrom: event.target.value })}
                    placeholder="noreply@your-domain.com"
                  />
                </label>
                <div className="admin-form-actions">
                  <button className="action-button" type="submit" disabled={emailLoading}>
                    <Save />
                    <span>{emailLoading ? "保存中..." : "保存配置"}</span>
                  </button>
                  {emailError && <span className="field-hint">{emailError}</span>}
                </div>
              </form>
            )}
          </div>
        )}
        {activeTab === "users" && (
          <div className="admin-panel">
            <h2>用户管理</h2>
            <p className="admin-desc">管理平台注册用户</p>

            <div className="admin-toolbar">
              <div className="search-input-wrap">
                <Search />
                <input
                  className="search-input"
                  type="search"
                  placeholder="搜索邮箱或昵称..."
                  value={userSearch}
                  onChange={(e) => handleUserSearch(e.target.value)}
                />
              </div>
            </div>

            {userError && <div className="form-error">{userError}</div>}
            {resetMsg && <div className="form-success">{resetMsg}</div>}

            {userLoading ? (
              <p className="admin-loading">加载中...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>昵称</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>注册时间</th>
                    <th style={{ width: 160 }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-empty">暂无用户</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="admin-user-cell">
                            <span className="admin-avatar">{u.displayName.slice(0, 1).toUpperCase()}</span>
                            <span>{u.displayName}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`admin-role-badge ${u.role}`}>{u.role === "admin" ? "管理员" : "用户"}</span>
                        </td>
                        <td className="admin-date">{new Date(u.createdAt).toLocaleDateString("zh-CN")}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button className="admin-action-btn" type="button" title="编辑" onClick={() => openEditDialog(u)}>
                              <Pencil />
                            </button>
                            <button className="admin-action-btn" type="button" title="重置密码" onClick={() => handleResetPassword(u)}>
                              <KeyRound />
                            </button>
                            <button className="admin-action-btn danger" type="button" title="删除" onClick={() => handleDeleteUser(u)}>
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {editingUser && (
              <div className="modal-backdrop" role="presentation">
                <form className="modal profile-modal" onSubmit={handleEditSave}>
                  <div className="modal-header">
                    <h2>编辑用户</h2>
                    <button className="icon-button" type="button" onClick={() => setEditingUser(null)} aria-label="关闭">
                      <X />
                    </button>
                  </div>
                  <label className="field">
                    <span>昵称</span>
                    <input value={editForm.displayName} onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })} required maxLength={80} />
                  </label>
                  <label className="field">
                    <span>邮箱</span>
                    <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required maxLength={128} />
                  </label>
                  <label className="field">
                    <span>角色</span>
                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                      <option value="user">用户</option>
                      <option value="admin">管理员</option>
                    </select>
                  </label>
                  {editError && <div className="form-error">{editError}</div>}
                  <button className="action-button wide" type="submit" disabled={editSaving}>
                    <Save />
                    <span>{editSaving ? "保存中..." : "保存"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
