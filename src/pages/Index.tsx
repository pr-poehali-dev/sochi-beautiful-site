import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
// v3 — guide removed, redesigned

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
  { name: "Radisson Blu Resort", stars: 5, desc: "Роскошный курорт прямо на берегу Чёрного моря с панорамными видами и бассейнами", price: "от 12 000 ₽", img: HOTEL_IMG, tag: "Топ выбор" },
  { name: "Горки Город", stars: 5, desc: "Олимпийский горный курорт с прямым доступом к горнолыжным трассам Розы Хутор", price: "от 9 500 ₽", img: MOUNTAIN_IMG, tag: "Горный курорт" },
  { name: "Pullman Сочи Центр", stars: 5, desc: "Современный отель в историческом центре Сочи, в 5 минутах от набережной", price: "от 7 200 ₽", img: HOTEL_IMG, tag: "В центре" },
  { name: "Mercure Сочи Центр", stars: 4, desc: "Стильный отель с превосходным видом на море и развитой инфраструктурой", price: "от 4 800 ₽", img: HOTEL_IMG, tag: "Лучшая цена" },
];

const attractionsList = [
  { name: "Роза Хутор", emoji: "🏔️", desc: "Горнолыжный курорт мирового уровня. 102 км трасс, перепад высот 1760 м. Работает круглогодично.", grad: "linear-gradient(135deg,#0077b6,#00b4d8)" },
  { name: "Сочинский Дендрарий", emoji: "🌿", desc: "Парк с более чем 1800 видами растений со всего мира на склонах Кавказского хребта.", grad: "linear-gradient(135deg,#1b4332,#40916c)" },
  { name: "Олимпийский Парк", emoji: "🏟️", desc: "Наследие Олимпиады‑2014. Стадионы, арены и фонтан «Сочи» — шоу каждый вечер.", grad: "linear-gradient(135deg,#b5451b,#f77f00)" },
  { name: "Ривьера", emoji: "🎡", desc: "Старейший парк города на берегу моря. Аттракционы, концерты и великолепный пляж.", grad: "linear-gradient(135deg,#7b2d8b,#c77dff)" },
  { name: "Агурские водопады", emoji: "💧", desc: "Каскад из трёх живописных водопадов в Хостинском ущелье. Незабываемый трекинг.", grad: "linear-gradient(135deg,#023e8a,#48cae4)" },
  { name: "Мацеста", emoji: "♨️", desc: "Знаменитые сероводородные источники, известные с XIX века. Здоровье и восстановление.", grad: "linear-gradient(135deg,#6a0572,#e040fb)" },
];

const historyList = [
  { year: "1838", label: "Основание", event: "Основание Форта Александрия — начало истории Сочи как русского поселения на Черноморском побережье" },
  { year: "1896", label: "Статус города", event: "Сочи получает статус города и начинает развиваться как курортный центр Российской империи" },
  { year: "1934", label: "Всесоюзная здравница", event: "Сочи объявлен всесоюзной здравницей — строятся грандиозные санатории сталинской эпохи" },
  { year: "1961", label: "Дендрарий", event: "Открытие Сочинского дендрария и активное озеленение города, формирующее его уникальный облик" },
  { year: "2014", label: "Олимпиада", event: "XXII Зимние Олимпийские игры превращают Сочи в мировой курорт с инфраструктурой высшего класса" },
];

const weatherIconsMap: Record<string, string> = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};
function getWeatherEmoji(icon: string) { return weatherIconsMap[icon.slice(0, 2)] || "🌤️"; }

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const cur = sections.find(s => {
        const el = sectionRefs.current[s];
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 100 && r.bottom > 100;
      });
      if (cur) setActiveSection(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (activeSection === "weather" && !weather && !weatherLoading) fetchWeather();
  }, [activeSection]);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setWeather(data);
    } catch {
      setWeather({ temp: 24, feels_like: 26, humidity: 65, wind_speed: 3.5, description: "Ясно", icon: "01d", city: "Сочи", mock: true });
    } finally {
      setWeatherLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="app">

      {/* ── NAV ── */}
      <nav className={`nav ${scrollY > 50 ? "nav--solid" : ""}`}>
        <button className="nav__logo" onClick={() => scrollTo("home")}>
          <span>СОЧИ</span><span className="nav__logo-wave">〰</span>
        </button>
        <div className={`nav__links ${menuOpen ? "open" : ""}`}>
          {sections.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`nav__link ${activeSection === s ? "active" : ""}`}>
              {sectionLabels[s]}
            </button>
          ))}
        </div>
        <button className="burger" onClick={() => setMenuOpen(v => !v)}>
          <span className={menuOpen ? "rot45" : ""} />
          <span className={menuOpen ? "hide" : ""} />
          <span className={menuOpen ? "rot-45" : ""} />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="home" ref={el => { sectionRefs.current.home = el; }} className="hero">
        <div className="hero__parallax" style={{ backgroundImage: `url(${HERO_IMG})`, transform: `scale(1.15) translateY(${scrollY * 0.3}px)` }} />
        <div className="hero__vignette" />
        <div className="hero__noise" />

        {/* floating orbs */}
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="hero__content">
          <p className="hero__eyebrow">Жемчужина Черноморья</p>
          <h1 className="hero__title">
            <span className="hero__word hero__word--1">Открой</span>
            <span className="hero__word hero__word--2">Сочи</span>
          </h1>
          <p className="hero__sub">Море · Горы · Субтропики · Олимпийское наследие</p>
          <div className="hero__btns">
            <button className="cta" onClick={() => scrollTo("attractions")}>Исследовать</button>
            <button className="cta cta--ghost" onClick={() => scrollTo("hotels")}>Найти отель</button>
          </div>
        </div>

        <div className="hero__stats">
          {[["300+", "дней солнца"], ["2900", "метров в горах"], ["118", "км пляжей"]].map(([n, l]) => (
            <div key={l} className="hero__stat">
              <span className="hero__stat-n">{n}</span>
              <span className="hero__stat-l">{l}</span>
            </div>
          ))}
        </div>

        <button className="scroll-hint" onClick={() => scrollTo("history")}>
          <span>Прокрути вниз</span>
          <Icon name="ChevronDown" size={18} />
        </button>
      </section>

      {/* ── HISTORY ── */}
      <section id="history" ref={el => { sectionRefs.current.history = el; }} className="section s-history">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">С 1838 года</span>
            <h2>История Сочи</h2>
            <p>От казачьего форта до олимпийской столицы мира</p>
          </div>

          <div className="timeline">
            <div className="timeline__line" />
            {historyList.map((f, i) => (
              <div key={i} className={`tl-item ${i % 2 === 0 ? "tl-item--l" : "tl-item--r"}`}>
                <div className="tl-card">
                  <span className="tl-card__year">{f.year}</span>
                  <span className="tl-card__label">{f.label}</span>
                  <p className="tl-card__text">{f.event}</p>
                </div>
                <div className="tl-dot" />
              </div>
            ))}
          </div>

          <div className="history-facts">
            {[
              { icon: "🌴", title: "Субтропики", text: "Единственный в России субтропический климат — пальмы, бамбук и магнолии в открытом грунте." },
              { icon: "🏛️", title: "Архитектура эпох", text: "Сталинский ампир, советский модернизм и ультрасовременные олимпийские объекты под одним небом." },
              { icon: "🥇", title: "Олимпийское наследие", text: "После 2014 года город превратился в курорт мирового уровня с горными и прибрежными кластерами." },
            ].map(f => (
              <div key={f.title} className="fact-card">
                <span className="fact-card__icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOTELS ── */}
      <section id="hotels" ref={el => { sectionRefs.current.hotels = el; }} className="section s-hotels">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Лучшие отели</span>
            <h2>Где остановиться</h2>
            <p>Роскошные курорты и уютные бутик-отели</p>
          </div>
          <div className="hotels-grid">
            {hotelsList.map((h, i) => (
              <div key={i} className="h-card">
                <div className="h-card__img-wrap">
                  <img src={h.img} alt={h.name} />
                  <span className="h-card__badge">{h.tag}</span>
                  <div className="h-card__shine" />
                </div>
                <div className="h-card__body">
                  <div className="h-card__stars">{"★".repeat(h.stars)}<span>{"★".repeat(5 - h.stars)}</span></div>
                  <h3>{h.name}</h3>
                  <p>{h.desc}</p>
                  <div className="h-card__footer">
                    <span className="h-card__price">{h.price}<small>/ночь</small></span>
                    <button className="h-card__btn">Подробнее →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATTRACTIONS ── */}
      <section id="attractions" ref={el => { sectionRefs.current.attractions = el; }} className="section s-attr">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Что посмотреть</span>
            <h2>Достопримечательности</h2>
            <p>Шесть мест, которые покорят с первого взгляда</p>
          </div>
          <div className="attr-grid">
            {attractionsList.map((a, i) => (
              <div key={i} className="a-card" style={{ background: a.grad }}>
                <div className="a-card__glow" />
                <span className="a-card__emoji">{a.emoji}</span>
                <h3>{a.name}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>

          <div className="attr-banner">
            <img src={MOUNTAIN_IMG} alt="Роза Хутор" />
            <div className="attr-banner__overlay" />
            <div className="attr-banner__content">
              <span className="pill pill--light">Жемчужина курорта</span>
              <h3>Роза Хутор</h3>
              <p>Горнолыжный курорт мирового уровня в 40 км от Сочи. 102 км трасс, перепад высот 1760 м. Работает круглогодично.</p>
              <button className="cta cta--sm">Подробнее</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WEATHER ── */}
      <section id="weather" ref={el => { sectionRefs.current.weather = el; }} className="section s-weather">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Live</span>
            <h2>Погода в Сочи</h2>
            <p>Актуальные данные обновляются при открытии раздела</p>
          </div>

          <div className="weather-box">
            {weatherLoading && (
              <div className="weather-loader">
                <div className="weather-loader__ring" />
                <p>Получаю данные...</p>
              </div>
            )}
            {!weatherLoading && !weather && (
              <button className="cta" onClick={fetchWeather}>Узнать погоду</button>
            )}
            {!weatherLoading && weather && (
              <div className="weather-data">
                <div className="weather-data__left">
                  <span className="weather-data__emoji">{getWeatherEmoji(weather.icon)}</span>
                  <div>
                    <div className="weather-data__temp">{weather.temp}°C</div>
                    <div className="weather-data__desc">{weather.description}</div>
                    <div className="weather-data__city">г. Сочи</div>
                  </div>
                </div>
                <div className="weather-data__right">
                  <div className="weather-param">
                    <Icon name="Thermometer" size={18} />
                    <span>Ощущается</span>
                    <strong>{weather.feels_like}°</strong>
                  </div>
                  <div className="weather-param">
                    <Icon name="Droplets" size={18} />
                    <span>Влажность</span>
                    <strong>{weather.humidity}%</strong>
                  </div>
                  <div className="weather-param">
                    <Icon name="Wind" size={18} />
                    <span>Ветер</span>
                    <strong>{weather.wind_speed} м/с</strong>
                  </div>
                  <button className="weather-refresh" onClick={fetchWeather}>
                    <Icon name="RefreshCw" size={14} /> Обновить
                  </button>
                </div>
                {weather.mock && <p className="weather-mock">* Демо-данные. Добавьте API-ключ OpenWeatherMap для реальной погоды.</p>}
              </div>
            )}
          </div>

          <div className="seasons">
            {[
              { s: "Зима", t: "+8°", e: "❄️", d: "Горнолыжный сезон" },
              { s: "Весна", t: "+18°", e: "🌸", d: "Цветение садов" },
              { s: "Лето", t: "+28°", e: "☀️", d: "Пляжный сезон" },
              { s: "Осень", t: "+20°", e: "🍂", d: "Бархатный сезон" },
            ].map(item => (
              <div key={item.s} className="season-card">
                <span className="season-card__icon">{item.e}</span>
                <strong>{item.s}</strong>
                <span className="season-card__temp">{item.t}</span>
                <p>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" ref={el => { sectionRefs.current.contacts = el; }} className="section s-contacts">
        <div className="wrap">
          <div className="s-head">
            <span className="pill">Контакты</span>
            <h2>Планируете поездку?</h2>
            <p>Мы поможем организовать незабываемый отдых</p>
          </div>
          <div className="contacts-grid">
            <div className="contacts-info">
              {[
                { icon: "MapPin" as const, title: "Адрес", val: "г. Сочи, ул. Навагинская, 16" },
                { icon: "Phone" as const, title: "Телефон", val: "+7 (862) 264-00-00" },
                { icon: "Mail" as const, title: "Email", val: "hello@sochi-guide.ru" },
                { icon: "Clock" as const, title: "Часы работы", val: "Ежедневно 9:00 — 21:00" },
              ].map(c => (
                <div key={c.title} className="c-item">
                  <div className="c-item__icon"><Icon name={c.icon} size={20} /></div>
                  <div>
                    <span>{c.title}</span>
                    <strong>{c.val}</strong>
                  </div>
                </div>
              ))}
            </div>

            <form className="contacts-form" onSubmit={handleSend}>
              <h3>Написать нам</h3>
              {sent ? (
                <div className="form-success">
                  <span>✅</span>
                  <p>Сообщение отправлено! Свяжемся с вами в течение часа.</p>
                </div>
              ) : (
                <>
                  <input required placeholder="Ваше имя" value={contactForm.name}
                    onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} />
                  <input required type="email" placeholder="Email" value={contactForm.email}
                    onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} />
                  <textarea required rows={4} placeholder="Расскажите о вашей поездке..." value={contactForm.message}
                    onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} />
                  <button type="submit" className="cta" style={{ width: "100%" }}>Отправить</button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <span>СОЧИ</span>
            <p>Жемчужина Черноморья</p>
          </div>
          <nav className="footer__nav">
            {sections.map(s => <button key={s} onClick={() => scrollTo(s)}>{sectionLabels[s]}</button>)}
          </nav>
          <p className="footer__copy">© 2025 Сочи-Гид. Все права защищены.</p>
        </div>
      </footer>

    </div>
  );
}