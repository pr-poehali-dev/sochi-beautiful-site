import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const WEATHER_URL = "https://functions.poehali.dev/549ae944-06e3-4a12-a60d-d0bdfa0deec9";
const HERO_IMG = "https://cdn.poehali.dev/projects/3dbd131e-1785-4a18-85a0-ece76d10b787/files/5d281416-9da2-4d27-b4e0-ffa501274947.jpg";
const HOTEL_IMG = "https://cdn.poehali.dev/projects/3dbd131e-1785-4a18-85a0-ece76d10b787/files/429e716b-4d04-4ad2-9607-5e4664a9002a.jpg";
const MOUNTAIN_IMG = "https://cdn.poehali.dev/projects/3dbd131e-1785-4a18-85a0-ece76d10b787/files/1808fd80-6f68-4838-95d2-cf4114bbe1dd.jpg";

const sections = ["home", "history", "hotels", "attractions", "weather", "contacts"];
const sectionLabels: Record<string, string> = {
  home: "Главная", history: "История", hotels: "Отели",
  attractions: "Места", weather: "Погода", contacts: "Контакты",
};

interface WeatherData {
  temp: number; feels_like: number; humidity: number;
  wind_speed: number; description: string; icon: string; city: string; mock?: boolean;
}

const hotelsList = [
  { name: "Radisson Blu Resort", stars: 5, desc: "Роскошный пятизвёздочный курорт прямо на берегу Чёрного моря. Собственный пляж, три бассейна, спа-центр и рестораны с панорамным видом на море.", price: "от 12 000 ₽", img: HOTEL_IMG, tag: "Топ выбор", feat: ["Частный пляж", "СПА-центр", "3 бассейна"] },
  { name: "Горки Город", stars: 5, desc: "Олимпийский горный курорт в сердце Красной Поляны. Прямой доступ к трассам Розы Хутор, горнолыжный инструктаж и рестораны на высоте 960 м.", price: "от 9 500 ₽", img: MOUNTAIN_IMG, tag: "Горный курорт", feat: ["Горные трассы", "Канатная дорога", "Ски-рум"] },
  { name: "Pullman Сочи Центр", stars: 5, desc: "Современный дизайн-отель в историческом центре города. 5 минут пешком до набережной, фитнес-зал, крытый бассейн и деловой центр.", price: "от 7 200 ₽", img: HOTEL_IMG, tag: "В центре", feat: ["Центр города", "Деловой центр", "Бассейн"] },
  { name: "Mercure Сочи Центр", stars: 4, desc: "Стильный отель с превосходным видом на море. Идеален для семейного отдыха — детская зона, анимация и близость к пляжу Ривьера.", price: "от 4 800 ₽", img: HOTEL_IMG, tag: "Лучшая цена", feat: ["Вид на море", "Детская зона", "Анимация"] },
];

const attractionsList = [
  { name: "Роза Хутор", emoji: "🏔️", desc: "Горнолыжный курорт мирового уровня. 102 км трасс, перепад высот 1760 м, 14 трасс разного уровня сложности. Летом — трекинг, маунтинбайк и верёвочный парк.", grad: "#0077b6,#00b4d8", extra: "2320 м над уровнем моря" },
  { name: "Сочинский Дендрарий", emoji: "🌿", desc: "Уникальный парк площадью 48 га с 1800+ видами растений со всего мира. Два яруса, соединённых канатной дорогой, скульптуры и исторические беседки.", grad: "#1b4332,#52b788", extra: "Основан в 1892 году" },
  { name: "Олимпийский Парк", emoji: "🏟️", desc: "Наследие Олимпиады‑2014: 6 арен, стадион «Фишт», Formula-1 трасса. Поющий фонтан — ежевечернее шоу с подсветкой и музыкой на берегу Чёрного моря.", grad: "#b5451b,#f77f00", extra: "Площадь 200 га" },
  { name: "Ривьера", emoji: "🎡", desc: "Старейший парк-курорт Сочи (1898 г.) на берегу Чёрного моря. Розарий, аттракционы, дельфинарий, концертный зал и чистый галечный пляж.", grad: "#7b2d8b,#c77dff", extra: "Основан в 1898 году" },
  { name: "Агурские водопады", emoji: "💧", desc: "Каскад из трёх водопадов высотой 21, 12 и 23 метра в Хостинском ущелье. Маршрут 5 км через реликтовый лес с орлиными скалами и Чёртовым ущельем.", grad: "#023e8a,#48cae4", extra: "3 водопада · 5 км маршрут" },
  { name: "Мацеста", emoji: "♨️", desc: "Уникальный бальнеологический курорт с сероводородными источниками. Лечит суставы, сердечно-сосудистые и кожные заболевания. Известен с 1902 года.", grad: "#6a0572,#e040fb", extra: "Известна с 1902 года" },
];

const historyList = [
  { year: "1838", label: "Основание форта", event: "Основание Форта Александрия — начало истории Сочи как русского поселения на Черноморском побережье после Кавказской войны.", icon: "⚔️" },
  { year: "1896", label: "Статус города", event: "Сочи получает статус города. Начинается строительство дорог, первых курортных зданий и развитие инфраструктуры для приёма гостей.", icon: "🏙️" },
  { year: "1909", label: "Первый курорт", event: "Открывается первый официальный курорт «Кавказская Ривьера» с четырьмя гостиницами на 360 номеров — начало курортной эпохи Сочи.", icon: "🏨" },
  { year: "1934", label: "Всесоюзная здравница", event: "Сталин провозглашает Сочи «всесоюзной здравницей». Возводятся грандиозные санатории в стиле сталинского ампира, многие из которых работают до сих пор.", icon: "🏛️" },
  { year: "1961", label: "Дендрарий", event: "Открытие обновлённого Сочинского дендрария и масштабное озеленение города. Сочи становится «городом-садом» с уникальным субтропическим климатом.", icon: "🌳" },
  { year: "2014", label: "Олимпиада", event: "XXII Зимние Олимпийские игры. Построены 6 олимпийских арен, горный кластер Красной Поляны, новые дороги и инфраструктура мирового уровня.", icon: "🏅" },
];

const weatherIconsMap: Record<string, string> = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};
function getWeatherEmoji(icon: string) { return weatherIconsMap[icon.slice(0, 2)] || "🌤️"; }

// 3D tilt hook
function useTilt(strength = 15) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale3d(1.04,1.04,1.04)`;
  }, [strength]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);
  return { ref, onMove, onLeave };
}

function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const { ref, onMove, onLeave } = useTilt(12);
  return (
    <div ref={ref} className={`tilt-card ${className ?? ""}`} style={style}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

// Particle canvas
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(72,202,228,${d.o})`;
        ctx.fill();
      });
      // connect nearby
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(72,202,228,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const cur = sections.find(s => {
        const el = sectionRefs.current[s]; if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 100 && r.bottom > 100;
      });
      if (cur) setActiveSection(cur);
    };
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  useEffect(() => {
    if (activeSection === "weather" && !weather && !weatherLoading) fetchWeather();
  }, [activeSection]);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error();
      setWeather(await res.json());
    } catch {
      setWeather({ temp: 24, feels_like: 26, humidity: 65, wind_speed: 3.5, description: "Ясно", icon: "01d", city: "Сочи", mock: true });
    } finally { setWeatherLoading(false); }
  };

  const scrollTo = (id: string) => { sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 4000);
    setContactForm({ name: "", email: "", message: "" });
  };

  // cursor-follower parallax for hero
  const heroShiftX = (mousePos.x / window.innerWidth  - 0.5) * 18;
  const heroShiftY = (mousePos.y / window.innerHeight - 0.5) * 10;

  return (
    <div className="app">

      {/* ══ NAV ══ */}
      <nav className={`nav ${scrollY > 50 ? "nav--solid" : ""}`}>
        <button className="nav__logo" onClick={() => scrollTo("home")}>
          <span className="nav__logo-text">СОЧИ</span>
          <span className="nav__logo-accent">★</span>
        </button>
        <div className={`nav__links ${menuOpen ? "open" : ""}`}>
          {sections.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`nav__link ${activeSection === s ? "active" : ""}`}>
              {sectionLabels[s]}
              {activeSection === s && <span className="nav__link-dot" />}
            </button>
          ))}
        </div>
        <button className="burger" onClick={() => setMenuOpen(v => !v)}>
          <span className={menuOpen ? "rot45" : ""} />
          <span className={menuOpen ? "hide" : ""} />
          <span className={menuOpen ? "rot-45" : ""} />
        </button>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" ref={el => { sectionRefs.current.home = el; }} className="hero">
        <Particles />
        <div className="hero__parallax" style={{
          backgroundImage: `url(${HERO_IMG})`,
          transform: `scale(1.18) translateY(${scrollY * 0.28}px) translateX(${heroShiftX * 0.3}px)`
        }} />
        <div className="hero__vignette" />

        {/* animated orbs */}
        <div className="orb orb1" style={{ transform: `translate(${heroShiftX * 0.8}px, ${heroShiftY * 0.8}px)` }} />
        <div className="orb orb2" style={{ transform: `translate(${-heroShiftX * 0.6}px, ${-heroShiftY * 0.6}px)` }} />
        <div className="orb orb3" />
        <div className="orb orb4" />

        {/* grid lines decoration */}
        <div className="hero__grid" />

        <div className="hero__content" style={{ transform: `translateX(${heroShiftX * 0.15}px) translateY(${heroShiftY * 0.1}px)` }}>
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-line" />
            <span>Жемчужина Черноморья</span>
            <span className="hero__eyebrow-line" />
          </div>
          <h1 className="hero__title">
            <span className="hero__word hero__word--1">Открой</span>
            <span className="hero__word hero__word--2">Сочи</span>
          </h1>
          <p className="hero__sub">Море · Горы · Субтропики · Олимпийское наследие</p>
          <div className="hero__tags">
            {["🌊 Чёрное море", "🏔 Кавказ", "☀️ 300+ дней солнца", "🏅 Олимпиада 2014"].map(t => (
              <span key={t} className="hero__tag">{t}</span>
            ))}
          </div>
          <div className="hero__btns">
            <button className="cta cta--glow" onClick={() => scrollTo("attractions")}>
              <span className="cta__shine" />
              Исследовать город
            </button>
            <button className="cta cta--ghost" onClick={() => scrollTo("hotels")}>
              Найти отель
            </button>
          </div>
        </div>

        <div className="hero__stats">
          {[["300+", "дней солнца", "☀️"], ["2900", "м высота гор", "⛰"], ["118", "км пляжей", "🌊"], ["1.5M", "туристов в год", "👥"]].map(([n, l, e]) => (
            <div key={l} className="hero__stat">
              <span className="hero__stat-e">{e}</span>
              <span className="hero__stat-n">{n}</span>
              <span className="hero__stat-l">{l}</span>
            </div>
          ))}
        </div>

        <button className="scroll-hint" onClick={() => scrollTo("history")}>
          <span>Прокрути вниз</span>
          <div className="scroll-hint__arrow"><Icon name="ChevronDown" size={16} /></div>
        </button>
      </section>

      {/* ══ HISTORY ══ */}
      <section id="history" ref={el => { sectionRefs.current.history = el; }} className="section s-history">
        <div className="section-bg-deco section-bg-deco--left" />
        <div className="wrap">
          <div className="s-head">
            <span className="pill">С 1838 года</span>
            <h2>История Сочи</h2>
            <p>Шесть эпох, которые превратили казачий форт в город-курорт мирового уровня</p>
          </div>

          <div className="timeline">
            <div className="timeline__track" />
            {historyList.map((f, i) => (
              <div key={i} className={`tl-row ${i % 2 === 0 ? "tl-row--l" : "tl-row--r"}`}>
                {i % 2 === 0 ? (
                  <>
                    <TiltCard className="tl-card">
                      <span className="tl-card__icon">{f.icon}</span>
                      <span className="tl-card__year">{f.year}</span>
                      <span className="tl-card__label">{f.label}</span>
                      <p className="tl-card__text">{f.event}</p>
                    </TiltCard>
                    <div className="tl-center"><div className="tl-dot" /><div className="tl-line-h" /></div>
                    <div className="tl-spacer" />
                  </>
                ) : (
                  <>
                    <div className="tl-spacer" />
                    <div className="tl-center"><div className="tl-line-h tl-line-h--r" /><div className="tl-dot" /></div>
                    <TiltCard className="tl-card">
                      <span className="tl-card__icon">{f.icon}</span>
                      <span className="tl-card__year">{f.year}</span>
                      <span className="tl-card__label">{f.label}</span>
                      <p className="tl-card__text">{f.event}</p>
                    </TiltCard>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="facts-grid">
            {[
              { icon: "🌴", title: "Единственные субтропики", text: "Сочи — единственный в России город с влажным субтропическим климатом. Средняя температура января +7°C, а летом море прогревается до +27°C." },
              { icon: "🏛️", title: "Город-сад", text: "Здесь произрастает более 3000 видов растений, включая пальмы, кипарисы, эвкалипты и бамбук, высаженные ещё при Сталине." },
              { icon: "🥇", title: "Олимпийское наследие", text: "После Игр-2014 Сочи получил 6 современных арен, горный кластер, новую трассу «Формулы-1» и стал круглогодичным курортом." },
              { icon: "🚂", title: "Жемчужина Кавказа", text: "Уникальное расположение: горы Кавказа защищают от холодных ветров, а Чёрное море создаёт мягкий морской климат круглый год." },
            ].map(f => (
              <TiltCard key={f.title} className="fact-card">
                <div className="fact-card__icon-wrap"><span>{f.icon}</span></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOTELS ══ */}
      <section id="hotels" ref={el => { sectionRefs.current.hotels = el; }} className="section s-hotels">
        <div className="section-bg-deco section-bg-deco--right" />
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Лучшие отели</span>
            <h2>Где остановиться</h2>
            <p>От роскошных пятизвёздочных курортов до уютных бутик-отелей у самого моря</p>
          </div>
          <div className="hotels-grid">
            {hotelsList.map((h, i) => (
              <TiltCard key={i} className="h-card">
                <div className="h-card__img-wrap">
                  <img src={h.img} alt={h.name} loading="lazy" />
                  <div className="h-card__img-overlay" />
                  <span className="h-card__badge">{h.tag}</span>
                  <div className="h-card__stars-overlay">{"★".repeat(h.stars)}</div>
                </div>
                <div className="h-card__body">
                  <h3>{h.name}</h3>
                  <p>{h.desc}</p>
                  <div className="h-card__features">
                    {h.feat.map(f => <span key={f} className="h-card__feat">✓ {f}</span>)}
                  </div>
                  <div className="h-card__footer">
                    <div>
                      <span className="h-card__price">{h.price}</span>
                      <span className="h-card__night">/ночь</span>
                    </div>
                    <button className="h-card__btn">Забронировать →</button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ATTRACTIONS ══ */}
      <section id="attractions" ref={el => { sectionRefs.current.attractions = el; }} className="section s-attr">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Что посмотреть</span>
            <h2>Достопримечательности</h2>
            <p>Шесть уникальных мест, которые покорят с первого взгляда</p>
          </div>
          <div className="attr-grid">
            {attractionsList.map((a, i) => (
              <TiltCard key={i} className="a-card" style={{ background: `linear-gradient(145deg,${a.grad})` }}>
                <div className="a-card__inner">
                  <div className="a-card__top">
                    <span className="a-card__emoji">{a.emoji}</span>
                    <span className="a-card__extra">{a.extra}</span>
                  </div>
                  <h3>{a.name}</h3>
                  <p>{a.desc}</p>
                  <div className="a-card__shine" />
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="attr-feature">
            <div className="attr-feature__img-wrap">
              <img src={MOUNTAIN_IMG} alt="Роза Хутор" />
              <div className="attr-feature__img-overlay" />
            </div>
            <div className="attr-feature__content">
              <span className="pill pill--light">Жемчужина курорта</span>
              <h3>Роза Хутор</h3>
              <p>Горнолыжный курорт мирового уровня в 40 км от Сочи. 102 км трасс, 14 подъёмников, перепад высот 1760 м. Работает круглогодично: зимой — лыжи и сноуборд, летом — трекинг, маунтинбайк и канатные дороги с видом на вершины Кавказского хребта.</p>
              <div className="attr-feature__stats">
                {[["102 км", "трасс"], ["1760 м", "перепад высот"], ["14", "подъёмников"], ["2320 м", "вершина"]].map(([v, l]) => (
                  <div key={l} className="attr-feature__stat">
                    <strong>{v}</strong><span>{l}</span>
                  </div>
                ))}
              </div>
              <button className="cta cta--glow cta--sm">Узнать подробнее</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WEATHER ══ */}
      <section id="weather" ref={el => { sectionRefs.current.weather = el; }} className="section s-weather">
        <div className="section-bg-deco section-bg-deco--center" />
        <div className="wrap">
          <div className="s-head">
            <span className="pill pill--live">● Live</span>
            <h2>Погода в Сочи</h2>
            <p>Актуальные данные погоды обновляются при открытии раздела</p>
          </div>

          <div className="weather-wrap">
            <div className="weather-box">
              <div className="weather-box__glow" />
              {weatherLoading && (
                <div className="weather-loader">
                  <div className="weather-loader__ring" /><p>Получаю данные...</p>
                </div>
              )}
              {!weatherLoading && !weather && (
                <div className="weather-empty">
                  <span className="weather-empty__icon">🌤️</span>
                  <p>Нажмите, чтобы узнать актуальную погоду</p>
                  <button className="cta cta--glow" onClick={fetchWeather}>Узнать погоду</button>
                </div>
              )}
              {!weatherLoading && weather && (
                <div className="weather-data">
                  <div className="weather-data__hero">
                    <span className="weather-data__emoji">{getWeatherEmoji(weather.icon)}</span>
                    <div className="weather-data__main">
                      <div className="weather-data__temp">{weather.temp}<span>°C</span></div>
                      <div className="weather-data__desc">{weather.description}</div>
                      <div className="weather-data__city">
                        <Icon name="MapPin" size={13} /> г. Сочи, Россия
                      </div>
                    </div>
                  </div>
                  <div className="weather-data__params">
                    <div className="weather-param">
                      <div className="weather-param__icon"><Icon name="Thermometer" size={18} /></div>
                      <span>Ощущается</span><strong>{weather.feels_like}°</strong>
                    </div>
                    <div className="weather-param">
                      <div className="weather-param__icon"><Icon name="Droplets" size={18} /></div>
                      <span>Влажность</span><strong>{weather.humidity}%</strong>
                    </div>
                    <div className="weather-param">
                      <div className="weather-param__icon"><Icon name="Wind" size={18} /></div>
                      <span>Ветер</span><strong>{weather.wind_speed} м/с</strong>
                    </div>
                    <div className="weather-param">
                      <div className="weather-param__icon"><Icon name="Eye" size={18} /></div>
                      <span>Видимость</span><strong>10 км</strong>
                    </div>
                  </div>
                  <button className="weather-refresh" onClick={fetchWeather}>
                    <Icon name="RefreshCw" size={13} /> Обновить
                  </button>
                  {weather.mock && <p className="weather-mock">* Тестовые данные. Добавьте OPENWEATHER_API_KEY для реальных.</p>}
                </div>
              )}
            </div>

            <div className="seasons-col">
              <h4 className="seasons-title">Климат по сезонам</h4>
              {[
                { s: "Зима", t: "+6°–+10°", e: "❄️", d: "Горнолыжный сезон на Розе Хутор. Снег в горах, у моря — мягко.", sea: "+9°" },
                { s: "Весна", t: "+14°–+20°", e: "🌸", d: "Цветение глициний и магнолий. Первые купания в конце мая.", sea: "+16°" },
                { s: "Лето", t: "+26°–+31°", e: "☀️", d: "Пляжный пик. Море прогревается до +27°C, солнечно каждый день.", sea: "+27°" },
                { s: "Осень", t: "+18°–+24°", e: "🍂", d: "Бархатный сезон — меньше туристов, тепло, море ещё тёплое.", sea: "+23°" },
              ].map(item => (
                <div key={item.s} className="season-row">
                  <span className="season-row__e">{item.e}</span>
                  <div className="season-row__info">
                    <strong>{item.s}</strong>
                    <span className="season-row__t">{item.t}</span>
                    <p>{item.d}</p>
                  </div>
                  <div className="season-row__sea">
                    <Icon name="Waves" size={14} />
                    <span>{item.sea}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACTS ══ */}
      <section id="contacts" ref={el => { sectionRefs.current.contacts = el; }} className="section s-contacts">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Контакты</span>
            <h2>Планируете поездку?</h2>
            <p>Мы поможем организовать незабываемый отдых в Сочи</p>
          </div>
          <div className="contacts-grid">
            <div className="contacts-left">
              <div className="contacts-info">
                {([
                  { icon: "MapPin" as const,  title: "Адрес",          val: "г. Сочи, ул. Навагинская, 16" },
                  { icon: "Phone" as const,   title: "Телефон",        val: "+7 (862) 264-00-00" },
                  { icon: "Mail" as const,    title: "Email",          val: "hello@sochi-guide.ru" },
                  { icon: "Clock" as const,   title: "Часы работы",    val: "Ежедневно 9:00 — 21:00" },
                  { icon: "Globe" as const,   title: "Социальные сети",val: "VK · Telegram · Instagram" },
                ] as const).map(c => (
                  <div key={c.title} className="c-item">
                    <div className="c-item__icon"><Icon name={c.icon} size={19} /></div>
                    <div><span>{c.title}</span><strong>{c.val}</strong></div>
                  </div>
                ))}
              </div>
              <div className="contacts-map">
                <div className="contacts-map__pin">📍</div>
                <span>Сочи · Краснодарский край</span>
                <div className="contacts-map__grid" />
              </div>
            </div>

            <TiltCard className="contacts-form">
              <h3>Написать нам</h3>
              <p className="contacts-form__sub">Ответим в течение часа в рабочее время</p>
              {sent ? (
                <div className="form-success">
                  <span>✅</span>
                  <strong>Сообщение отправлено!</strong>
                  <p>Свяжемся с вами в течение часа.</p>
                </div>
              ) : (
                <form onSubmit={handleSend}>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Ваше имя</label>
                      <input required placeholder="Иван Иванов" value={contactForm.name}
                        onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-field">
                      <label>Email</label>
                      <input required type="email" placeholder="ivan@mail.ru" value={contactForm.email}
                        onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Сообщение</label>
                    <textarea required rows={4} placeholder="Расскажите о вашей поездке — даты, пожелания..." value={contactForm.message}
                      onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="cta cta--glow" style={{ width: "100%", justifyContent: "center" }}>
                    <span className="cta__shine" />Отправить сообщение
                  </button>
                </form>
              )}
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="footer__glow" />
        <div className="footer__inner">
          <div className="footer__brand">
            <span>СОЧИ</span>
            <span className="footer__brand-star">★</span>
            <p>Жемчужина Черноморья</p>
          </div>
          <nav className="footer__nav">
            {sections.map(s => <button key={s} onClick={() => scrollTo(s)}>{sectionLabels[s]}</button>)}
          </nav>
          <div className="footer__divider" />
          <p className="footer__copy">© 2025 Сочи-Гид — Путеводитель по лучшему курорту России</p>
        </div>
      </footer>

    </div>
  );
}
