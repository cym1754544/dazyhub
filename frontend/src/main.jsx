import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Camera,
  FolderPlus,
  Folder,
  FolderOpen,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import {
  clearToken,
  changePassword,
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
  { id: "ungrouped", name: "未分组", color: "#2f7890" },
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
  { id: "dark", name: "深色", colors: ["#1a1b2e", "#1e3a5f", "#f0a45e"] },
  { id: "warm", name: "暖白", colors: ["#fff9ed", "#2f7890", "#5fa87b"] },
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

function moveItem(items, draggedId, targetGroup, targetId, placement = "before") {
  if (!targetId || draggedId === targetId) return items;

  const dragged = items.find((item) => item.id === draggedId);

  if (!dragged) return items;

  const next = items.filter((item) => item.id !== draggedId);
  const targetIndex = next.findIndex((item) => item.id === targetId && item.group === targetGroup);

  if (targetIndex === -1) return items;

  next.splice(placement === "after" ? targetIndex + 1 : targetIndex, 0, { ...dragged, group: targetGroup });
  return next;
}

function moveItemToGroupEnd(items, draggedId, targetGroup) {
  const dragged = items.find((item) => item.id === draggedId);

  if (!dragged) return items;

  const groupItems = items.filter((item) => item.group === targetGroup);
  if (dragged.group === targetGroup && groupItems[groupItems.length - 1]?.id === draggedId) return items;

  const next = items.filter((item) => item.id !== draggedId);
  const insertAfter = next.reduce((lastIndex, item, index) => (
    item.group === targetGroup ? index : lastIndex
  ), -1);

  next.splice(insertAfter + 1, 0, { ...dragged, group: targetGroup });
  return next;
}

function parseSettingsJson(value, fallback) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizeGroups(groups) {
  const source = Array.isArray(groups) && groups.length ? groups : initialGroups;
  const seen = new Set();

  return source
    .filter((group) => group?.id && !seen.has(group.id) && group.id !== "all")
    .map((group) => {
      seen.add(group.id);
      return {
        ...group,
        name: group.name || "未命名文件夹",
        color: group.color || "#5fa87b",
        parentId: group.parentId || null,
        collapsed: Boolean(group.collapsed),
      };
    });
}

function collectGroupDescendants(groups, groupId) {
  const descendants = new Set();
  const visit = (id) => {
    groups
      .filter((group) => group.parentId === id)
      .forEach((child) => {
        if (descendants.has(child.id)) return;
        descendants.add(child.id);
        visit(child.id);
      });
  };

  visit(groupId);
  return descendants;
}

function buildFolderTree(groups) {
  const byParent = groups.reduce((map, group) => {
    const parentId = group.parentId || "root";
    if (!map.has(parentId)) map.set(parentId, []);
    map.get(parentId).push(group);
    return map;
  }, new Map());

  const build = (parentId = "root", depth = 0) => (byParent.get(parentId) || []).map((group) => ({
    ...group,
    depth,
    children: build(group.id, depth + 1),
  }));

  return build();
}

function flattenFolderTree(nodes) {
  return nodes.flatMap((node) => [
    node,
    ...(node.collapsed ? [] : flattenFolderTree(node.children || [])),
  ]);
}

const DRAG_REORDER_COOLDOWN_MS = 320;
const CARD_FLIP_DURATION_MS = 420;
const CONTEXT_MENU_WIDTH = 172;
const CONTEXT_MENU_HEIGHT = 112;
const GROUP_REORDER_COOLDOWN_MS = 800;

function menuPosition(clientX, clientY, width = CONTEXT_MENU_WIDTH, height = CONTEXT_MENU_HEIGHT) {
  const margin = 10;
  const maxX = window.innerWidth - width - margin;
  const maxY = window.innerHeight - height - margin;

  return {
    x: Math.max(margin, Math.min(clientX, maxX)),
    y: Math.max(margin, Math.min(clientY, maxY)),
  };
}

function hasDragType(event, type) {
  return Array.from(event.dataTransfer?.types || []).includes(type);
}

function App() {
  const [sites, setSites] = useState([...starterShortcuts, ...starterSites]);
  const [siteGroups, setSiteGroups] = useState(initialGroups);
  const [activeGroup, setActiveGroup] = useState("all");
  const [allGroupCollapsed, setAllGroupCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragState, setDragState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [addSiteGroup, setAddSiteGroup] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [addingGroup, setAddingGroup] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [tagSize, setTagSize] = useState(() => localStorage.getItem("dazyhub_tagSize") || "short");
  const [theme, setTheme] = useState(() => localStorage.getItem("dazyhub_theme") || "warm");
  const [searchEngineId, setSearchEngineId] = useState(() => localStorage.getItem("dazyhub_searchEngine") || "google");
  const [confirmDelete, setConfirmDelete] = useState(() => localStorage.getItem("dazyhub_confirmDelete") !== "false");
  const [toast, setToast] = useState(null);
  const [isSearchEngineOpen, setIsSearchEngineOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [contentContextMenu, setContentContextMenu] = useState(null);
  const [groupDragState, setGroupDragState] = useState(null);
  const cardRectsRef = useRef(new Map());
  const groupRectsRef = useRef(new Map());
  const lastDragMoveRef = useRef({ targetId: null, placement: null, movedAt: 0 });
  const lastGroupReorderRef = useRef({ at: 0, targetId: null });
  const skipNextCardAnimationRef = useRef(false);
  const pendingDragScrollRef = useRef(null);
  const latestSiteGroupsRef = useRef(siteGroups);
  const latestSitesRef = useRef(sites);
  const activeSiteDragRef = useRef(null);
  const groupListRef = useRef(null);

  const rememberDragScrollPosition = () => {
    if (!activeSiteDragRef.current?.draggedId) return;
    pendingDragScrollRef.current = { x: window.scrollX, y: window.scrollY };
  };

  const animateGroupReorder = (callback) => {
    const container = groupListRef.current;
    if (!container) {
      callback();
      return;
    }
    const items = container.querySelectorAll(".group-row");
    const firstRects = new Map();
    items.forEach((item) => {
      const key = item.getAttribute("data-group-id") || item.querySelector(".group-button")?.textContent?.trim();
      if (key) firstRects.set(key, item.getBoundingClientRect());
    });

    callback();

    requestAnimationFrame(() => {
      const newItems = container.querySelectorAll(".group-row");
      newItems.forEach((item) => {
        const key = item.getAttribute("data-group-id") || item.querySelector(".group-button")?.textContent?.trim();
        const first = firstRects.get(key);
        if (!first) return;
        const last = item.getBoundingClientRect();
        const deltaY = first.top - last.top;
        if (deltaY !== 0) {
          item.style.transform = `translateY(${deltaY}px)`;
          item.style.transition = "none";
          requestAnimationFrame(() => {
            item.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
            item.style.transform = "";
          });
        }
      });
    });
  };

  useEffect(() => {
    latestSiteGroupsRef.current = siteGroups;
  }, [siteGroups]);

  useEffect(() => {
    latestSitesRef.current = sites;
  }, [sites]);

  const applyUserSettings = (user) => {
    if (user.tagSize) {
      setTagSize(user.tagSize);
      localStorage.setItem("dazyhub_tagSize", user.tagSize);
    }
    if (user.theme) {
      setTheme(user.theme);
      localStorage.setItem("dazyhub_theme", user.theme);
    }
    if (user.searchEngine) {
      setSearchEngineId(user.searchEngine);
      localStorage.setItem("dazyhub_searchEngine", user.searchEngine);
    }
    if (user.confirmDelete !== undefined && user.confirmDelete !== null) {
      setConfirmDelete(user.confirmDelete);
      localStorage.setItem("dazyhub_confirmDelete", user.confirmDelete ? "true" : "false");
    }
    setSites(parseSettingsJson(user.sitesJson, [...starterShortcuts, ...starterSites]));
    setSiteGroups(normalizeGroups(parseSettingsJson(user.siteGroupsJson, initialGroups)));
    if (user.activeGroup) setActiveGroup(user.activeGroup);
  };

  const buildPageSettings = (overrides = {}) => ({
    sitesJson: JSON.stringify(overrides.sites || sites),
    siteGroupsJson: JSON.stringify(overrides.siteGroups || siteGroups),
    activeGroup: overrides.activeGroup || activeGroup,
  });

  const persistSettings = async (payload, options = {}) => {
    if (!currentUser) return;

    try {
      const updatedUser = await updateSettings(options.includePage ? { ...buildPageSettings(options.page || {}), ...payload } : payload);
      setCurrentUser(updatedUser);
      if (!options.skipApply) {
        applyUserSettings(updatedUser);
      }
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

  useEffect(() => {
    if (!dragState) return;

    const clearDragState = () => {
      lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
      skipNextCardAnimationRef.current = true;
      setDragState(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") clearDragState();
    };

    window.addEventListener("dragend", clearDragState);
    window.addEventListener("drop", clearDragState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("dragend", clearDragState);
      window.removeEventListener("drop", clearDragState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dragState]);

  useEffect(() => {
    if (!contentContextMenu) return;
    const handleDown = (e) => {
      if (!e.target.closest(".context-menu")) setContentContextMenu(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setContentContextMenu(null);
    };
    const handleScroll = () => setContentContextMenu(null);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [contentContextMenu]);

  useLayoutEffect(() => {
    const pendingScroll = pendingDragScrollRef.current;
    const cards = document.querySelectorAll("[data-site-id]");
    const previousRects = cardRectsRef.current;
    const nextRects = new Map();
    const skipAnimation = skipNextCardAnimationRef.current;

    skipNextCardAnimationRef.current = false;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const previous = previousRects.get(card.dataset.siteId);
      nextRects.set(card.dataset.siteId, rect);

      if (!previous || skipAnimation || !dragState?.draggedId) return;

      const deltaX = previous.left - rect.left;
      const deltaY = previous.top - rect.top;

      if (!deltaX && !deltaY) return;

      card.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: CARD_FLIP_DURATION_MS,
          easing: "cubic-bezier(.22, 1, .36, 1)",
        },
      );
    });

    cardRectsRef.current = nextRects;

    if (pendingScroll && activeSiteDragRef.current?.draggedId) {
      window.scrollTo(pendingScroll.x, pendingScroll.y);
      requestAnimationFrame(() => {
        window.scrollTo(pendingScroll.x, pendingScroll.y);
        if (pendingDragScrollRef.current === pendingScroll) pendingDragScrollRef.current = null;
      });
    } else {
      pendingDragScrollRef.current = null;
    }
  }, [sites]);

  const filteredSections = useMemo(() => {
    return siteGroups
      .map((group) => {
        const items = sites.filter((site) => {
          const inGroup = site.group === group.id;
          const inActiveGroup = activeGroup === "all" || site.group === activeGroup;
          return inGroup && inActiveGroup;
        });

        return { ...group, items };
      })
      .filter((section) => section.items.length > 0 || activeGroup === section.id);
  }, [activeGroup, siteGroups, sites]);

  const folderTree = useMemo(() => buildFolderTree(siteGroups), [siteGroups]);
  const visibleFolders = useMemo(() => flattenFolderTree(folderTree), [folderTree]);
  const foldersUnderAll = useMemo(() => visibleFolders.map((group) => ({
    ...group,
    displayDepth: group.depth + 1,
  })), [visibleFolders]);

  useLayoutEffect(() => {
    const groups = document.querySelectorAll("[data-group-section-id]");
    const previousRects = groupRectsRef.current;
    const nextRects = new Map();

    groups.forEach((group) => {
      const rect = group.getBoundingClientRect();
      const previous = previousRects.get(group.dataset.groupSectionId);
      nextRects.set(group.dataset.groupSectionId, rect);

      if (!previous) return;

      const deltaX = previous.left - rect.left;
      const deltaY = previous.top - rect.top;

      if (!deltaX && !deltaY) return;

      group.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 420,
          easing: "cubic-bezier(.22, 1, .36, 1)",
        },
      );
    });

    groupRectsRef.current = nextRects;
  }, [filteredSections]);

  const selectedSearchEngine = searchEngines.find((engine) => engine.id === searchEngineId) || searchEngines[0];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextQuery = searchQuery.trim();

    if (!nextQuery) return;

    window.open(selectedSearchEngine.searchUrl(nextQuery), "_blank", "noreferrer");
  };

  const handleDragStart = (event, site) => {
    if (contentContextMenu) setContentContextMenu(null);
    activeSiteDragRef.current = { draggedId: site.id, hasMoved: false, didPersist: false };
    const dragPreview = event.currentTarget.cloneNode(true);
    const rect = event.currentTarget.getBoundingClientRect();
    dragPreview.classList.add("drag-preview");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    dragPreview.style.opacity = "1";
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, event.clientX - rect.left, event.clientY - rect.top);
    window.setTimeout(() => dragPreview.remove(), 120);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", site.id);
    event.dataTransfer.setData("application/x-dazyhub-site", site.id);
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setDragState({ draggedId: site.id, sourceGroup: site.group, overGroup: site.group, overId: site.id, placement: "before", hasMoved: false });
  };

  const handleDragOver = (event, targetGroup, targetId = null, placement = "before") => {
    if (hasDragType(event, "application/x-dazyhub-group")) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    setDragState((current) => {
      const draggedId = current?.draggedId;

      if (!draggedId) return current;

      const now = performance.now();
      const lastMove = lastDragMoveRef.current;
      const canReorder = now - lastMove.movedAt > DRAG_REORDER_COOLDOWN_MS;
      const sameHoverTarget = lastMove.targetId === targetId && lastMove.placement === placement;

      if (draggedId && targetId && draggedId !== targetId && !sameHoverTarget && canReorder) {
        rememberDragScrollPosition();
        setSites((currentSites) => {
          const nextSites = moveItem(currentSites, draggedId, targetGroup, targetId, placement);
          latestSitesRef.current = nextSites;
          return nextSites;
        });
        if (activeSiteDragRef.current?.draggedId === draggedId) {
          activeSiteDragRef.current.hasMoved = true;
        }
        lastDragMoveRef.current = { targetId, placement, movedAt: now };
      }

      return {
        draggedId,
        sourceGroup: current?.sourceGroup,
        overGroup: targetGroup,
        overId: targetId,
        placement,
        hasMoved: current?.hasMoved || Boolean(draggedId && targetId && draggedId !== targetId),
      };
    });
  };

  const handleDrop = (event, targetGroup, targetId = null) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain") || dragState?.draggedId;

    if (!draggedId) {
      lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
      setDragState(null);
      return;
    }

    if (!targetId && dragState?.overId) {
      if (!activeSiteDragRef.current?.didPersist) {
        persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current }, skipApply: true });
        if (activeSiteDragRef.current) activeSiteDragRef.current.didPersist = true;
      }
    } else if (!targetId) {
      skipNextCardAnimationRef.current = true;
      rememberDragScrollPosition();
      setSites((currentSites) => {
        const nextSites = moveItemToGroupEnd(currentSites, draggedId, targetGroup);
        if (nextSites === currentSites) return currentSites;
        latestSitesRef.current = nextSites;
        persistSettings({}, { includePage: true, page: { sites: nextSites }, skipApply: true });
        activeSiteDragRef.current = { draggedId, hasMoved: true, didPersist: true };
        return nextSites;
      });
    } else {
      if (!activeSiteDragRef.current?.didPersist) {
        persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current }, skipApply: true });
        if (activeSiteDragRef.current) activeSiteDragRef.current.didPersist = true;
      }
    }
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    skipNextCardAnimationRef.current = true;
    setDragState(null);
    requestAnimationFrame(() => setDragState(null));
  };

  const handleDragEnd = () => {
    if (activeSiteDragRef.current?.hasMoved && !activeSiteDragRef.current.didPersist) {
      persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current }, skipApply: true });
    }
    activeSiteDragRef.current = null;
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    skipNextCardAnimationRef.current = true;
    setDragState(null);
    requestAnimationFrame(() => setDragState(null));
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
    localStorage.setItem("dazyhub_tagSize", nextTagSize);
    persistSettings({ tagSize: nextTagSize });
  };

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem("dazyhub_theme", nextTheme);
    persistSettings({ theme: nextTheme });
  };

  const handleSearchEngineChange = (nextSearchEngineId) => {
    setSearchEngineId(nextSearchEngineId);
    localStorage.setItem("dazyhub_searchEngine", nextSearchEngineId);
    persistSettings({ searchEngine: nextSearchEngineId });
  };

  const handleConfirmDeleteChange = (nextConfirmDelete) => {
    setConfirmDelete(nextConfirmDelete);
    localStorage.setItem("dazyhub_confirmDelete", nextConfirmDelete ? "true" : "false");
    persistSettings({ confirmDelete: nextConfirmDelete });
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
      persistSettings({}, { includePage: true, page: { sites: nextSites, activeGroup: nextSite.group }, skipApply: true });
      return nextSites;
    });
    setActiveGroup(site.group || "all");
    setAddSiteGroup(null);
    setToast("网站已添加");
  };

  const handleUpdateSite = (updatedSite) => {
    setSites((currentSites) => {
      const nextSites = currentSites.map((site) => (
        site.id === updatedSite.id ? { ...site, ...updatedSite } : site
      ));
      persistSettings({}, { includePage: true, page: { sites: nextSites }, skipApply: true });
      return nextSites;
    });
    setEditingSite(null);
    setToast("网站已更新");
  };

  const handleDeleteSite = (siteId) => {
    setSites((currentSites) => {
      const nextSites = currentSites.filter((site) => site.id !== siteId);
      persistSettings({}, { includePage: true, page: { sites: nextSites }, skipApply: true });
      return nextSites;
    });
    setToast("网站已删除");
  };

  const requestDeleteSite = (siteId, siteName) => {
    if (confirmDelete) {
      setConfirmDialog({
        message: `确认删除网站「${siteName}」？`,
        onConfirm: () => handleDeleteSite(siteId),
      });
    } else {
      handleDeleteSite(siteId);
    }
  };

  const handleRenameGroup = ({ id, name, color }) => {
    setSiteGroups((currentGroups) => {
      const nextGroups = currentGroups.map((group) => (
        group.id === id ? { ...group, name, color: color || group.color } : group
      ));
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
    setEditingGroup(null);
    setToast("分组已更新");
  };

  const handleAddGroup = ({ name, color, parentId = null }) => {
    const newId = `group-${Date.now()}`;
    setSiteGroups((currentGroups) => {
      const nextGroups = [...currentGroups, { id: newId, name, color, parentId, collapsed: false }];
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups, activeGroup: newId }, skipApply: true });
      return nextGroups;
    });
    setAddingGroup(false);
    setActiveGroup(newId);
    setToast("文件夹已添加");
  };

  const handleAddRootGroup = () => {
    setAddingGroup({ parentId: null, parentName: "" });
  };

  const handleAddChildGroup = (group) => {
    setAddingGroup({ parentId: group.id, parentName: group.name });
    setSiteGroups((currentGroups) => {
      const nextGroups = currentGroups.map((currentGroup) => (
        currentGroup.id === group.id ? { ...currentGroup, collapsed: false } : currentGroup
      ));
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
  };

  const handleToggleGroup = (groupId) => {
    setSiteGroups((currentGroups) => {
      const nextGroups = currentGroups.map((group) => (
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      ));
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
  };

  const handleDeleteGroup = (groupId) => {
    const group = siteGroups.find((currentGroup) => currentGroup.id === groupId);
    if (!group) return;

    const removedIds = collectGroupDescendants(siteGroups, groupId);
    removedIds.add(groupId);
    const nextGroups = siteGroups.filter((currentGroup) => !removedIds.has(currentGroup.id));
    const nextSites = sites.map((site) => (
      removedIds.has(site.group) ? { ...site, group: "ungrouped" } : site
    ));
    const nextActiveGroup = removedIds.has(activeGroup) ? "all" : activeGroup;

    setSiteGroups(nextGroups);
    setSites(nextSites);
    setActiveGroup(nextActiveGroup);
    persistSettings({}, { includePage: true, page: { siteGroups: nextGroups, sites: nextSites, activeGroup: nextActiveGroup }, skipApply: true });
    setEditingGroup(null);
    setToast("文件夹已删除，里面的网站已移到未分组");
  };

  const handleActiveGroupChange = (nextActiveGroup) => {
    setActiveGroup(nextActiveGroup);
    persistSettings({}, { includePage: true, page: { activeGroup: nextActiveGroup }, skipApply: true });
  };

  const handleGroupDragStart = (event, group) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-dazyhub-group", group.id);
    const dragPreview = event.currentTarget.cloneNode(true);
    const rect = event.currentTarget.getBoundingClientRect();
    dragPreview.classList.add("group-drag-preview");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    dragPreview.style.setProperty("--folder-depth", event.currentTarget.style.getPropertyValue("--folder-depth") || "0");
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, event.clientX - rect.left, event.clientY - rect.top);
    window.setTimeout(() => dragPreview.remove(), 0);
    lastGroupReorderRef.current = { at: 0, targetId: null };
    setGroupDragState({ draggedId: group.id, overId: group.id });
  };

  const handleGroupDragOver = (event, targetId) => {
    if (!hasDragType(event, "application/x-dazyhub-group")) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    const current = groupDragState;
    const draggedId = current?.draggedId;
    if (!draggedId || draggedId === targetId) {
      setGroupDragState(current ? { ...current, overId: targetId } : null);
      return;
    }
    const now = performance.now();
    const lastMove = lastGroupReorderRef.current;
    const canReorder = lastMove.targetId !== targetId || now - lastMove.at > GROUP_REORDER_COOLDOWN_MS;

    if (!canReorder) {
      setGroupDragState(current ? { ...current, overId: targetId } : null);
      return;
    }

    animateGroupReorder(() => {
      setSiteGroups((currentGroups) => {
        const draggedIndex = currentGroups.findIndex((g) => g.id === draggedId);
        const targetIndex = currentGroups.findIndex((g) => g.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1) return currentGroups;

        const nextGroups = [...currentGroups];
        const [draggedGroup] = nextGroups.splice(draggedIndex, 1);
        nextGroups.splice(targetIndex, 0, draggedGroup);
        return nextGroups;
      });
    });
    lastGroupReorderRef.current = { at: now, targetId };
    setGroupDragState({ ...current, overId: targetId });
  };

  const handleGroupDrop = (event, targetId) => {
    event.preventDefault();
    event.stopPropagation();
    persistSettings({}, { includePage: true, page: { siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    lastGroupReorderRef.current = { at: 0, targetId: null };
    setGroupDragState(null);
  };

  const handleGroupDragEnd = () => {
    if (groupDragState?.draggedId) {
      persistSettings({}, { includePage: true, page: { siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    }
    lastGroupReorderRef.current = { at: 0, targetId: null };
    setGroupDragState(null);
  };

  const isDraggingSite = Boolean(dragState?.draggedId);

  return (
    <div className={`app ${isDraggingSite ? "is-site-dragging" : ""}`} data-theme={theme}>
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
            <div className={`brand ${currentUser ? "is-signed-in" : ""}`}>
              <button
                className="brand-avatar"
                type="button"
                onClick={() => (currentUser ? setIsProfileOpen(true) : setAuthMode("login"))}
              >
                {currentUser ? <Avatar user={currentUser} size="brand" /> : <div className="brand-mark guest"><img src="/wenhao.jpeg" alt="" /></div>}
              </button>
              <div className="brand-name">
                <strong>{currentUser ? currentUser.displayName : "登录"}</strong>
                {currentUser && <span>{currentUser.signature || (currentUser.email || "").split("@")[0]}</span>}
              </div>
            </div>

            <div>
              <div className="nav-divider"></div>
              <nav ref={groupListRef} className="group-list" aria-label="网站分组">
                <div
                  className="group-row root-row"
                  data-group-id="all"
                  style={{ "--folder-depth": 0 }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsSettingsOpen(false);
                    setContentContextMenu({ ...menuPosition(event.clientX, event.clientY), type: "folder", groupId: "all" });
                  }}
                >
                    <button
                      className="folder-toggle"
                      type="button"
                      title={allGroupCollapsed ? "展开文件夹" : "折叠文件夹"}
                      aria-label={allGroupCollapsed ? "展开全部" : "折叠全部"}
                      onClick={() => setAllGroupCollapsed(!allGroupCollapsed)}
                    >
                      {allGroupCollapsed ? <ChevronRight /> : <ChevronDown />}
                    </button>
                    <button
                      className={`group-button ${activeGroup === "all" ? "is-active" : ""}`}
                      type="button"
                      onClick={() => handleActiveGroupChange("all")}
                    >
                      <span>{allGroupCollapsed ? <Folder /> : <FolderOpen />}全部</span>
                    </button>
                  </div>
                {!allGroupCollapsed && foldersUnderAll.map((group) => (
                  <div
                    className={`group-row ${groupDragState?.draggedId === group.id ? "is-dragging" : ""} ${groupDragState?.overId === group.id ? "is-drop-target" : ""}`}
                    key={group.id}
                    data-group-id={group.id}
                    style={{ "--folder-depth": group.displayDepth }}
                    draggable
                    onDragStart={(e) => handleGroupDragStart(e, group)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsSettingsOpen(false);
                      setContentContextMenu({ ...menuPosition(event.clientX, event.clientY), type: "folder", groupId: group.id });
                    }}
                    onDragOver={(e) => handleGroupDragOver(e, group.id)}
                    onDrop={(e) => handleGroupDrop(e, group.id)}
                    onDragEnd={handleGroupDragEnd}
                  >
                    {group.children?.length ? (
                      <button
                        className="folder-toggle"
                        type="button"
                        title={group.collapsed ? "展开文件夹" : "折叠文件夹"}
                        aria-label={group.collapsed ? `展开${group.name}` : `折叠${group.name}`}
                        onClick={() => handleToggleGroup(group.id)}
                      >
                        {group.collapsed ? <ChevronRight /> : <ChevronDown />}
                      </button>
                    ) : (
                      <span className="folder-toggle folder-toggle-placeholder" aria-hidden="true" />
                    )}
                    <button
                      className={`group-button ${activeGroup === group.id ? "is-active" : ""}`}
                      type="button"
                      onClick={() => handleActiveGroupChange(group.id)}
                    >
                      <span>{group.collapsed ? <Folder style={{ color: group.color }} /> : <FolderOpen style={{ color: group.color }} />}{group.name}</span>
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

          </div>
        </header>

        <div
          className="content"
          onContextMenu={(event) => {
            if (event.target.closest(".shortcut-card, .site-card, .context-menu, .section-title-edit, input, select, textarea, .toolbar, .settings-popover, .modal-backdrop")) return;
            event.preventDefault();
            const sectionEl = event.target.closest("[data-section-id]");
            const groupId = sectionEl?.dataset?.sectionId || "ungrouped";
            setIsSettingsOpen(false);
            setContentContextMenu({ ...menuPosition(event.clientX, event.clientY), type: "content", groupId });
          }}
        >
          {filteredSections.map((section) => (
            <SiteSection
              key={section.id}
              section={section}
              tagSize={tagSize}
              dragState={dragState}
              groupDragState={groupDragState}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onGroupDragStart={handleGroupDragStart}
              onGroupDragOver={handleGroupDragOver}
              onGroupDrop={handleGroupDrop}
              onGroupDragEnd={handleGroupDragEnd}
              onRenameGroup={handleRenameGroup}
              onEditSite={setEditingSite}
              onDeleteSite={(site) => requestDeleteSite(site.id, site.name)}
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
      {addingGroup && (
        <GroupEditorDialog
          group={{ id: null, name: "", color: "#5fa87b", parentId: addingGroup.parentId || null }}
          onClose={() => setAddingGroup(false)}
          onSubmit={handleAddGroup}
          isNew
          parentName={addingGroup.parentName}
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
            <div className="setting-row">
              <span>标签大小</span>
              <SettingSelect
                value={tagSize}
                options={[
                  { value: "short", label: "短" },
                  { value: "long", label: "长" },
                ]}
                onChange={handleTagSizeChange}
                ariaLabel="标签大小"
              />
            </div>
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
            <div className="setting-row">
              <span>删除确认</span>
              <button
                className={`toggle-btn ${confirmDelete ? "is-active" : ""}`}
                type="button"
                role="switch"
                aria-checked={confirmDelete}
                onClick={() => handleConfirmDeleteChange(!confirmDelete)}
              >
                <span className="toggle-track" />
              </button>
            </div>
            {currentUser && (
              <button
                className="setting-action"
                type="button"
                onClick={() => { setIsSettingsOpen(false); setIsPasswordChangeOpen(true); }}
              >
                <KeyRound />
                <span>修改密码</span>
              </button>
            )}
            {currentUser && (
              <button
                className="setting-action danger"
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
      {isPasswordChangeOpen && currentUser && (
        <PasswordChangeDialog
          onClose={() => setIsPasswordChangeOpen(false)}
          onSuccess={setToast}
        />
      )}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {contentContextMenu && (
        contentContextMenu.type === "folder" ? (
          <FolderContextMenu
            x={contentContextMenu.x}
            y={contentContextMenu.y}
            group={siteGroups.find((group) => group.id === contentContextMenu.groupId) || { id: contentContextMenu.groupId, name: contentContextMenu.groupId === "all" ? "全部" : "未分组" }}
            onAddSite={() => {
              setAddSiteGroup(contentContextMenu.groupId === "all" ? "ungrouped" : contentContextMenu.groupId);
              setContentContextMenu(null);
            }}
            onAddChild={() => {
              const group = siteGroups.find((currentGroup) => currentGroup.id === contentContextMenu.groupId);
              if (group) handleAddChildGroup(group);
              setContentContextMenu(null);
            }}
            onRename={() => {
              const group = siteGroups.find((currentGroup) => currentGroup.id === contentContextMenu.groupId);
              if (group) setEditingGroup(group);
              setContentContextMenu(null);
            }}
            onDelete={() => {
              handleDeleteGroup(contentContextMenu.groupId);
              setContentContextMenu(null);
            }}
          />
        ) : (
          <ContentContextMenu
            x={contentContextMenu.x}
            y={contentContextMenu.y}
            groupName={
              contentContextMenu.groupId === "ungrouped"
                ? siteGroups.find((g) => g.id === "ungrouped")?.name || "未分组"
                : siteGroups.find((group) => group.id === contentContextMenu.groupId)?.name || "当前分组"
            }
            onAddSite={() => {
              setAddSiteGroup(contentContextMenu.groupId);
              setContentContextMenu(null);
            }}
            onAddGroup={() => {
              setAddingGroup({ parentId: contentContextMenu.groupId === "ungrouped" ? null : contentContextMenu.groupId, parentName: contentContextMenu.groupId === "ungrouped" ? "" : siteGroups.find((group) => group.id === contentContextMenu.groupId)?.name || "" });
              setContentContextMenu(null);
            }}
          />
        )
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

function SettingSelect({ value, options, onChange, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const chooseOption = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className={`setting-select ${isOpen ? "is-open" : ""}`} ref={wrapperRef}>
      <button
        className="setting-select-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown />
      </button>
      {isOpen && (
        <div className="setting-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`setting-select-option ${option.value === value ? "is-selected" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => chooseOption(option.value)}
            >
              <span className="setting-select-check">{option.value === value ? "✓" : ""}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentContextMenu({ x, y, groupName, onAddSite, onAddGroup }) {
  const stopMenuEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="context-menu content-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="内容操作"
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={stopMenuEvent}
    >
      <div className="context-menu-label">{groupName}</div>
      <button type="button" role="menuitem" onClick={onAddSite}>
        <Plus />
        <span>新增标签</span>
      </button>
      <button type="button" role="menuitem" onClick={onAddGroup}>
        <FolderPlus />
        <span>添加文件夹</span>
      </button>
    </div>
  );
}

function FolderContextMenu({ x, y, group, onAddSite, onAddChild, onRename, onDelete }) {
  const stopMenuEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const [showNewMenu, setShowNewMenu] = useState(false);
  const isAllGroup = group?.id === "all";

  return (
    <div
      className="context-menu folder-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="文件夹操作"
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={stopMenuEvent}
    >
      <div
        className="context-menu-item-with-submenu"
        onMouseEnter={() => setShowNewMenu(true)}
        onMouseLeave={() => setShowNewMenu(false)}
      >
        <button
          type="button"
          role="menuitem"
          className="has-submenu"
        >
          <Plus />
          <span>新建</span>
          <ChevronRight className="submenu-arrow" />
        </button>
        {showNewMenu && (
          <div className="context-menu submenu">
            <button type="button" role="menuitem" onClick={onAddSite}>
              <Plus />
              <span>标签</span>
            </button>
            <button type="button" role="menuitem" onClick={onAddChild}>
              <FolderPlus />
              <span>文件夹</span>
            </button>
          </div>
        )}
      </div>
      <button type="button" role="menuitem" onClick={onRename}>
        <Pencil />
        <span>重命名</span>
      </button>
      <button
        className={`danger ${isAllGroup ? "muted" : ""}`}
        type="button"
        role="menuitem"
        onClick={onDelete}
      >
        <Trash2 />
        <span>删除</span>
      </button>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal confirm-modal">
        <div className="confirm-content">
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="action-button" type="button" onClick={onCancel}>
            取消
          </button>
          <button className="action-button danger" type="button" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordChangeDialog({ onClose, onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("新密码长度至少6位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      onSuccess("密码已更新");
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal password-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Security</p>
            <h2>修改密码</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <label className="field">
          <span>旧密码</span>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoFocus
            required
            minLength={6}
            placeholder="请输入当前密码"
          />
        </label>
        <label className="field">
          <span>新密码</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            maxLength={120}
            placeholder="至少6位"
          />
        </label>
        <label className="field">
          <span>确认新密码</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            maxLength={120}
            placeholder="再次输入新密码"
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <span className="field-hint">两次输入的密码不符</span>
          )}
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit" disabled={loading}>
          <Save />
          <span>{loading ? "保存中..." : "保存密码"}</span>
        </button>
      </form>
    </div>
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

  const handleLogout = () => {
    clearToken();
    onUserChange(null);
    onClose();
    onSuccess("已注销登录");
  };

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

        <button className="action-button wide logout" type="button" onClick={handleLogout}>
          <LogOut />
          <span>注销登录</span>
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
  const allGroups = flattenFolderTree(buildFolderTree(siteGroups));
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
              <option key={group.id} value={group.id}>{`${"　".repeat(group.depth || 0)}${group.name}`}</option>
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

function GroupEditorDialog({ group, onClose, onSubmit, isNew, parentName = "" }) {
  const [name, setName] = useState(group.name);
  const [color, setColor] = useState(group.color || "#5fa87b");
  const [error, setError] = useState("");
  const presetColors = ["#2f7890", "#5fa87b", "#f0a45e", "#dc7d76", "#818cf8", "#bd8736"];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      setError("请输入分组名称");
      return;
    }

    onSubmit({ id: group.id, name: nextName, color, parentId: group.parentId || null });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal group-modal" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Group</p>
            <h2>{isNew ? "添加文件夹" : "编辑文件夹"}</h2>
            {isNew && parentName && <span className="modal-subtitle">添加到 {parentName}</span>}
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

        <div className="color-preset-row" aria-label="常用颜色">
          {presetColors.map((preset) => (
            <button
              key={preset}
              className={`color-preset ${preset.toLowerCase() === color.toLowerCase() ? "is-active" : ""}`}
              type="button"
              aria-label={`选择颜色${preset}`}
              style={{ background: preset }}
              onClick={() => setColor(preset)}
            />
          ))}
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit">
          {isNew ? <Plus /> : <Save />}
          <span>{isNew ? "添加文件夹" : "保存文件夹"}</span>
        </button>
      </form>
    </div>
  );
}

function SiteSection({
  section,
  tagSize,
  dragState,
  groupDragState,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onGroupDragStart,
  onGroupDragOver,
  onGroupDrop,
  onGroupDragEnd,
  onRenameGroup,
  onEditSite,
  onDeleteSite,
}) {
  const gridClass = tagSize === "short" ? "tag-grid tag-grid-short" : "tag-grid tag-grid-long";
  const [groupName, setGroupName] = useState(section.name);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);

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
      className={`group-section ${dragState?.overGroup === section.id && !dragState.overId ? "is-drop-target" : ""} ${groupDragState?.draggedId === section.id ? "is-group-dragging" : ""} ${groupDragState?.overId === section.id ? "is-group-drop-target" : ""}`}
      data-section-id={section.id}
      data-group-section-id={section.id}
      onDragOver={(e) => {
        if (hasDragType(e, "application/x-dazyhub-group")) {
          e.preventDefault();
          onGroupDragOver?.(e, section.id);
        } else {
          onDragOver?.(e, section.id);
        }
      }}
      onDrop={(e) => {
        if (hasDragType(e, "application/x-dazyhub-group")) {
          e.preventDefault();
          onGroupDrop?.(e, section.id);
        } else {
          onDrop?.(e, section.id);
        }
      }}
      onDragEnd={() => onGroupDragEnd?.()}
    >
      <div className="section-heading">
        <div className="section-title-slot">
          {isEditingGroupName ? (
            <input
              className="section-title-edit"
              value={groupName}
              size={Math.max(6, groupName.length + 2)}
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
          ) : (
            <button
              className="section-title-button"
              type="button"
              title={`编辑${section.name}分组名称`}
              aria-label={`编辑${section.name}分组名称`}
              onClick={() => setIsEditingGroupName(true)}
            >
              {section.name}
            </button>
          )}
        </div>
        <button
          className="section-drag-handle"
          type="button"
          draggable
          title="拖动排序"
          aria-label="拖动排序"
          onDragStart={(e) => { e.stopPropagation(); onGroupDragStart?.(e, section); }}
        >
          <Menu />
        </button>
      </div>
      <div className={gridClass}>
        {section.items.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            tagSize={tagSize}
            isDragging={dragState?.draggedId === site.id}
            isSwapTarget={dragState?.overId === site.id && dragState?.draggedId !== site.id}
            dropPlacement={dragState?.overId === site.id ? dragState?.placement : null}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            onEdit={onEditSite}
            onDelete={onDeleteSite}
          />
        ))}
      </div>
    </section>
  );
}

function SiteCard({
  site,
  tagSize,
  isDragging,
  isSwapTarget,
  dropPlacement,
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

  const handleCardDragOver = (event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const placement = tagSize === "short"
      ? (event.clientX > rect.left + rect.width / 2 ? "after" : "before")
      : (event.clientY > rect.top + rect.height / 2 ? "after" : "before");

    onDragOver(event, site.group, site.id, placement);
  };

  const handleCardDrop = (event) => {
    event.stopPropagation();
    onDrop(event, site.group, site.id);
  };

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
        className={`${isShort ? "shortcut-card" : "site-card"} ${isDragging ? "is-dragging" : ""} ${isSwapTarget ? "is-swap-target" : ""} ${dropPlacement === "after" ? "is-drop-after" : ""}`}
        data-site-id={site.id}
        href={href}
        target="_blank"
        rel="noreferrer"
        draggable
        onDragStart={(event) => onDragStart(event, site)}
        onDragOver={handleCardDragOver}
        onDragEnd={onDragEnd}
        onDrop={handleCardDrop}
        onContextMenu={handleContextMenu}
      >
        <SiteIcon site={site} />
        {isShort ? (
          <strong>{site.name}</strong>
        ) : (
          <strong className="site-name-long">{site.name}</strong>
        )}
      </a>
      {contextMenu && (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onMouseDown={(e) => e.stopPropagation()}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(site); closeContextMenu(); }}>
            <Pencil /> 编辑
          </button>
          <button type="button" className="danger" onClick={(e) => { e.stopPropagation(); onDelete(site); closeContextMenu(); }}>
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
