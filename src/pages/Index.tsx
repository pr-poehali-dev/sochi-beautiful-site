import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const WEATHER_URL = "https://functions.poehali.dev/549ae944-06e3-4a12-a60d-d0bdfa0deec9";

const HERO_IMG = "https://cdn.poehali.dev/projects/3dbd131e-1785-4a18-85a0-ece76d10b787/files/5d281416-9da2-4d27-b4e0-ffa501274947.jpg";
const HOTEL_IMG = "https://cdn.poehali.dev/projects/3dbd131e-1785-4a18-85a0-ece76d10b787/files/429e716b-4d04-4ad2-9607-5e4664a9002a.jpg";
const MOUNTAIN_IMG = "https://cdn.poehali.dev/projects/3dbd131e-1785-4a18-85a0-ece76d10b787/files/1808fd80-6f68-4838-95d2-cf4114bbe1dd.jpg";

const sections = ["home", "history", "hotels", "attractions", "weather", "contacts"];
const sectionLabels: Record<string, string> = {
  home: "Главная",
  history: "История",
  hotels: "Отели",
  attractions: "Достопримечательности",
  weather: "Погода",
  contacts: "Контакты",
};

const guideMessages: Record<string, string> = {
  home: "Привет! Я Соня — твой гид по Сочи! Добро пожаловать в жемчужину Черноморского побережья 🌊",
  history: "Сочи — город с богатой историей! Позволь рассказать тебе, как этот курорт стал одним из главных в России 📜",
  hotels: "Здесь лучшие отели Сочи! От уютных бутик-отелей до роскошных пятизвёздочных курортов ✨",
  attractions: "Ох, сколько всего интересного! Горы, море, парки — Сочи удивит каждого туриста 🏔️",
  weather: "Посмотрим, какая погода в Сочи сейчас! Здесь почти всегда тепло и солнечно ☀️",
  contacts: "Остались вопросы? С удовольствием помогу! Пиши, звони — всегда на связи 💌",
};

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
  mock?: boolean;
}

const hotels = [
  {
    name: "Radisson Blu Resort",
    stars: 5,
    desc: "Роскошный курорт прямо на берегу Чёрного моря с панорамными видами и бассейнами",
    price: "от 12 000 ₽/ночь",
    img: HOTEL_IMG,
    tag: "Топ выбор",
  },
  {
    name: "Горки Город",
    stars: 5,
    desc: "Олимпийский горный курорт с прямым доступом к горнолыжным трассам Розы Хутор",
    price: "от 9 500 ₽/ночь",
    img: MOUNTAIN_IMG,
    tag: "Горный курорт",
  },
  {
    name: "Pullman Сочи Центр",
    stars: 5,
    desc: "Современный отель в историческом центре Сочи, в 5 минутах от набережной",
    price: "от 7 200 ₽/ночь",
    img: HOTEL_IMG,
    tag: "В центре",
  },
  {
    name: "Mercure Сочи Центр",
    stars: 4,
    desc: "Стильный отель с превосходным видом на море и развитой инфраструктурой",
    price: "от 4 800 ₽/ночь",
    img: HOTEL_IMG,
    tag: "Лучшая цена",
  },
];

const attractions = [
  {
    name: "Роза Хутор",
    emoji: "🏔️",
    desc: "Горнолыжный курорт мирового уровня. Летом — трекинг и канатные дороги, зимой — первоклассные трассы.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Сочинский Дендрарий",
    emoji: "🌿",
    desc: "Уникальный парк с более чем 1800 видами растений со всего мира. Настоящий ботанический рай.",
    color: "from-green-500 to-emerald-400",
  },
  {
    name: "Олимпийский Парк",
    emoji: "🏟️",
    desc: "Наследие Олимпиады-2014. Стадионы, арены и знаменитый фонтан «Сочи» — шоу каждый вечер.",
    color: "from-orange-500 to-amber-400",
  },
  {
    name: "Ривьера",
    emoji: "🎡",
    desc: "Старейший парк Сочи на берегу моря. Аттракционы, концерты и великолепный пляж.",
    color: "from-pink-500 to-rose-400",
  },
  {
    name: "Агурские водопады",
    emoji: "💧",
    desc: "Каскад из трёх живописных водопадов в Хостинском ущелье. Незабываемый трекинг по горной тропе.",
    color: "from-teal-500 to-blue-400",
  },
  {
    name: "Мацеста",
    emoji: "♨️",
    desc: "Знаменитые сероводородные ванны, целебные источники которых известны с XIX века. Здоровье и восстановление.",
    color: "from-violet-500 to-purple-400",
  },
];

const historyFacts = [
  { year: "1838", event: "Основание Форта Александрия — начало истории Сочи как русского поселения на Черноморском побережье" },
  { year: "1896", event: "Сочи получает статус города и начинает развиваться как курортный центр Российской империи" },
  { year: "1934", event: "Сочи объявлен всесоюзной здравницей — здесь строятся грандиозные санатории сталинской эпохи" },
  { year: "1961", event: "Открытие Сочинского дендрария и активное озеленение города, формирующее его уникальный облик" },
  { year: "2014", event: "XXII Зимние Олимпийские игры превращают Сочи в мировой курорт с инфраструктурой высшего класса" },
];

const weatherIconsMap: Record<string, string> = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};

function getWeatherEmoji(icon: string): string {
  const code = icon.slice(0, 2);
  return weatherIconsMap[code] || "🌤️";
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [guideVisible, setGuideVisible] = useState(true);
  const [guideKey, setGuideKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const current = sections.find((s) => {
        const el = sectionRefs.current[s];
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom > 120;
      });
      if (current && current !== activeSection) {
        setActiveSection(current);
        setGuidePop(true);
        setTimeout(() => setGuidePop(false), 600);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "weather" && !weather) {
      fetchWeather();
    }
  }, [activeSection]);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch(WEATHER_URL);
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

  return (
    <div className="sochi-app">
      {/* NAVBAR */}
      <nav className={`sochi-nav ${scrollY > 60 ? "sochi-nav--scrolled" : ""}`}>
        <div className="sochi-nav__logo" onClick={() => scrollTo("home")}>
          <span className="sochi-nav__logo-text">СОЧИ</span>
          <span className="sochi-nav__logo-dot">●</span>
        </div>
        <div className={`sochi-nav__links ${menuOpen ? "sochi-nav__links--open" : ""}`}>
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`sochi-nav__link ${activeSection === s ? "sochi-nav__link--active" : ""}`}
            >
              {sectionLabels[s]}
            </button>
          ))}
        </div>
        <button className="sochi-nav__burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* GUIDE GIRL */}
      {guideVisible && (
        <div className={`guide ${guidePop ? "guide--pop" : ""}`}>
          <div className="guide__bubble">
            <p>{guideMessages[activeSection]}</p>
          </div>
          <div className="guide__figure">
            <div className="guide__head">
              <div className="guide__face">
                <span className="guide__eyes">👀</span>
              </div>
              <div className="guide__hair" />
            </div>
            <div className="guide__body">
              <div className="guide__arm guide__arm--left" />
              <div className="guide__torso" />
              <div className="guide__arm guide__arm--right" />
            </div>
            <div className="guide__legs">
              <div className="guide__leg" />
              <div className="guide__leg" />
            </div>
          </div>
          <button className="guide__close" onClick={() => setGuideVisible(false)}>×</button>
        </div>
      )}
      {!guideVisible && (
        <button className="guide__reopen" onClick={() => setGuideVisible(true)}>
          <span>👩‍💼</span>
        </button>
      )}

      {/* HERO */}
      <section
        id="home"
        ref={(el) => { sectionRefs.current["home"] = el; }}
        className="hero"
      >
        <div
          className="hero__bg"
          style={{ backgroundImage: `url(${HERO_IMG})`, transform: `translateY(${scrollY * 0.4}px)` }}
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__badge">Жемчужина Черноморья</div>
          <h1 className="hero__title">
            <span className="hero__title-line">Открой</span>
            <span className="hero__title-line hero__title-line--accent">Сочи</span>
          </h1>
          <p className="hero__subtitle">
            Море, горы, солнце — всё в одном городе
          </p>
          <div className="hero__buttons">
            <button className="btn-primary" onClick={() => scrollTo("attractions")}>
              Исследовать
            </button>
            <button className="btn-outline" onClick={() => scrollTo("hotels")}>
              Найти отель
            </button>
          </div>
        </div>
        <div className="hero__scroll-hint" onClick={() => scrollTo("history")}>
          <span>Листай вниз</span>
          <Icon name="ChevronDown" size={20} />
        </div>
        <div className="hero__stats">
          <div className="hero__stat"><span className="hero__stat-num">+300</span><span>дней солнца</span></div>
          <div className="hero__stat"><span className="hero__stat-num">2900м</span><span>высота гор</span></div>
          <div className="hero__stat"><span className="hero__stat-num">118км</span><span>пляжей</span></div>
        </div>
      </section>

      {/* HISTORY */}
      <section
        id="history"
        ref={(el) => { sectionRefs.current["history"] = el; }}
        className="section section--history"
      >
        <div className="section__container">
          <div className="section__header">
            <span className="section__tag">С 1838 года</span>
            <h2 className="section__title">История Сочи</h2>
            <p className="section__subtitle">От казачьего форта до олимпийской столицы</p>
          </div>
          <div className="history__timeline">
            {historyFacts.map((fact, i) => (
              <div key={i} className={`history__item ${i % 2 === 0 ? "history__item--left" : "history__item--right"}`}>
                <div className="history__year">{fact.year}</div>
                <div className="history__dot" />
                <div className="history__card">
                  <p>{fact.event}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="history__extra">
            <div className="history__extra-card">
              <div className="history__extra-icon">🌊</div>
              <h3>Субтропический климат</h3>
              <p>Сочи — единственный в России город с настоящим субтропическим климатом. Здесь растут пальмы, бамбук и магнолии.</p>
            </div>
            <div className="history__extra-card">
              <div className="history__extra-icon">🏛️</div>
              <h3>Культурное наследие</h3>
              <p>Санатории сталинской эпохи, дача Сталина, дендрарий — уникальное архитектурное наследие разных эпох.</p>
            </div>
            <div className="history__extra-card">
              <div className="history__extra-icon">🎿</div>
              <h3>Олимпийское наследие</h3>
              <p>После Олимпиады-2014 Сочи стал курортом мирового уровня с развитой инфраструктурой и горными курортами.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOTELS */}
      <section
        id="hotels"
        ref={(el) => { sectionRefs.current["hotels"] = el; }}
        className="section section--hotels"
      >
        <div className="section__container">
          <div className="section__header">
            <span className="section__tag">Лучшие отели</span>
            <h2 className="section__title">Где остановиться</h2>
            <p className="section__subtitle">От уютных бутик-отелей до роскошных курортов</p>
          </div>
          <div className="hotels__grid">
            {hotels.map((hotel, i) => (
              <div key={i} className="hotel-card">
                <div className="hotel-card__img-wrap">
                  <img src={hotel.img} alt={hotel.name} className="hotel-card__img" />
                  <span className="hotel-card__tag">{hotel.tag}</span>
                </div>
                <div className="hotel-card__body">
                  <div className="hotel-card__stars">{"★".repeat(hotel.stars)}</div>
                  <h3 className="hotel-card__name">{hotel.name}</h3>
                  <p className="hotel-card__desc">{hotel.desc}</p>
                  <div className="hotel-card__footer">
                    <span className="hotel-card__price">{hotel.price}</span>
                    <button className="hotel-card__btn">Подробнее</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATTRACTIONS */}
      <section
        id="attractions"
        ref={(el) => { sectionRefs.current["attractions"] = el; }}
        className="section section--attractions"
      >
        <div className="section__container">
          <div className="section__header">
            <span className="section__tag">Что посмотреть</span>
            <h2 className="section__title">Достопримечательности</h2>
            <p className="section__subtitle">6 мест, которые нельзя пропустить</p>
          </div>
          <div className="attractions__grid">
            {attractions.map((a, i) => (
              <div key={i} className={`attraction-card bg-gradient-to-br ${a.color}`}>
                <span className="attraction-card__emoji">{a.emoji}</span>
                <h3 className="attraction-card__name">{a.name}</h3>
                <p className="attraction-card__desc">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="attractions__banner">
            <img src={MOUNTAIN_IMG} alt="Роза Хутор" className="attractions__banner-img" />
            <div className="attractions__banner-content">
              <h3>Роза Хутор</h3>
              <p>Горнолыжный курорт мирового уровня в 40 км от Сочи. 102 км трасс, перепад высот 1760 м. Работает круглогодично.</p>
              <button className="btn-primary">Узнать больше</button>
            </div>
          </div>
        </div>
      </section>

      {/* WEATHER */}
      <section
        id="weather"
        ref={(el) => { sectionRefs.current["weather"] = el; }}
        className="section section--weather"
      >
        <div className="section__container">
          <div className="section__header">
            <span className="section__tag">Актуально</span>
            <h2 className="section__title">Погода в Сочи</h2>
            <p className="section__subtitle">Обновляется в реальном времени</p>
          </div>
          <div className="weather__card">
            {weatherLoading && (
              <div className="weather__loading">
                <div className="weather__spinner" />
                <p>Загружаю данные...</p>
              </div>
            )}
            {!weatherLoading && !weather && (
              <button className="btn-primary" onClick={fetchWeather}>
                Узнать погоду
              </button>
            )}
            {weather && !weatherLoading && (
              <div className="weather__data">
                <div className="weather__main">
                  <span className="weather__emoji">{getWeatherEmoji(weather.icon)}</span>
                  <div className="weather__temp-wrap">
                    <span className="weather__temp">{weather.temp}°</span>
                    <span className="weather__desc">{weather.description}</span>
                  </div>
                </div>
                <div className="weather__details">
                  <div className="weather__detail">
                    <Icon name="Thermometer" size={20} />
                    <span>Ощущается как {weather.feels_like}°</span>
                  </div>
                  <div className="weather__detail">
                    <Icon name="Droplets" size={20} />
                    <span>Влажность {weather.humidity}%</span>
                  </div>
                  <div className="weather__detail">
                    <Icon name="Wind" size={20} />
                    <span>Ветер {weather.wind_speed} м/с</span>
                  </div>
                </div>
                {weather.mock && (
                  <p className="weather__mock-note">* Тестовые данные. Добавьте API-ключ для реальной погоды</p>
                )}
                <button className="weather__refresh" onClick={fetchWeather}>
                  <Icon name="RefreshCw" size={16} />
                  Обновить
                </button>
              </div>
            )}
          </div>
          <div className="weather__seasons">
            {[
              { season: "Зима", temp: "+8°", icon: "❄️", desc: "Горнолыжный сезон на Розе Хутор" },
              { season: "Весна", temp: "+18°", icon: "🌸", desc: "Цветение и первые купания" },
              { season: "Лето", temp: "+28°", icon: "☀️", desc: "Пляжный сезон, тёплое море" },
              { season: "Осень", temp: "+20°", icon: "🍂", desc: "Бархатный сезон, минус туристов" },
            ].map((s, i) => (
              <div key={i} className="weather__season">
                <span className="weather__season-icon">{s.icon}</span>
                <span className="weather__season-name">{s.season}</span>
                <span className="weather__season-temp">{s.temp}</span>
                <span className="weather__season-desc">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section
        id="contacts"
        ref={(el) => { sectionRefs.current["contacts"] = el; }}
        className="section section--contacts"
      >
        <div className="section__container">
          <div className="section__header">
            <span className="section__tag">Свяжитесь с нами</span>
            <h2 className="section__title">Контакты</h2>
            <p className="section__subtitle">Планируете поездку? Мы поможем!</p>
          </div>
          <div className="contacts__grid">
            <div className="contacts__info">
              <div className="contact-item">
                <div className="contact-item__icon"><Icon name="MapPin" size={22} /></div>
                <div>
                  <h4>Адрес</h4>
                  <p>г. Сочи, ул. Навагинская, 16</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon"><Icon name="Phone" size={22} /></div>
                <div>
                  <h4>Телефон</h4>
                  <p>+7 (862) 264-00-00</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon"><Icon name="Mail" size={22} /></div>
                <div>
                  <h4>Email</h4>
                  <p>hello@sochi-guide.ru</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon"><Icon name="Clock" size={22} /></div>
                <div>
                  <h4>Режим работы</h4>
                  <p>Ежедневно, 9:00 — 21:00</p>
                </div>
              </div>
            </div>
            <form className="contacts__form" onSubmit={(e) => e.preventDefault()}>
              <h3>Написать нам</h3>
              <input
                type="text"
                placeholder="Ваше имя"
                className="contacts__input"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="contacts__input"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
              <textarea
                placeholder="Ваше сообщение..."
                className="contacts__textarea"
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
              <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__content">
          <div className="footer__logo">СОЧИ<span>●</span></div>
          <p className="footer__copy">© 2024 Сочи — жемчужина Черноморья. Все права защищены.</p>
          <div className="footer__links">
            {sections.slice(0, 4).map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className="footer__link">
                {sectionLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}