import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { getTestimonials } from './services/testimonialsService'
import { submitLead } from './services/leadService'
import './styles.css'

const Arrow = () => <span aria-hidden="true">↗</span>

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header"><a className="logo" href="#top" aria-label="Снэпбилд — на главную"><span>снэп</span><b>билд</b></a><button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Открыть меню">{open ? 'Закрыть' : 'Меню'}</button><nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}><a href="#cases">Кейсы</a><a href="#metrics">Результаты</a><a href="#pricing">Тарифы</a><a href="#contact" className="button small">Начать сейчас</a></nav></header>
}

const SectionHead = ({ eyebrow, children, copy }) => <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{children}</h2></div>{copy && <p>{copy}</p>}</div>

function Hero() {
  return <section className="hero" id="top"><div className="hero-copy"><span className="pill"><i /> Платформа для бренд-команд</span><h1>Маркетинг в рамках вашей <em>дизайн-системы</em></h1><p>Создавайте сайты, кампании и презентации в фирменном стиле за минуты — без очереди к дизайнерам и разработчикам.</p><a href="#contact" className="button">Начать сейчас <Arrow /></a></div><div className="hero-visual" aria-label="Пример интерфейса Снэпбилд"><div className="visual-top"><div className="dots"><i/><i/><i/></div><span>Новая кампания</span><b>Опубликовать</b></div><div className="visual-body"><aside><strong>Слои</strong><span>Навигация</span><span className="active">Hero section</span><span>Преимущества</span><span>CTA</span></aside><div className="canvas"><span className="mini-pill">НОВЫЙ ПРОДУКТ</span><h3>Идея становится<br/>кампанией</h3><div className="mock-button">Узнать больше</div><div className="selection"><i/><i/><i/><i/></div></div></div><div className="prompt"><span>✦</span><p>Адаптируй страницу для финансового сектора</p><button>↑</button></div></div></section>
}

const cases = [
  { tag: 'ФИНТЕХ', title: 'Запуск продукта за 4 дня вместо 3 недель', text: 'Лендинг, 18 баннеров и презентация — из одного брифа, в единой дизайн-системе.', stat: '−81%', label: 'времени на запуск', theme: 'violet' },
  { tag: 'RETAIL', title: '120 локальных кампаний без дизайн-рутины', text: 'Команды в регионах самостоятельно адаптируют материалы, не нарушая правила бренда.', stat: '×6', label: 'больше кампаний', theme: 'lime' },
  { tag: 'B2B', title: 'Персональные лендинги для каждого сегмента', text: 'Маркетинг меняет оффер и контент, а платформа сохраняет сетку и компоненты.', stat: '34%', label: 'рост конверсии', theme: 'blue' }
]

function Cases() { return <section id="cases"><SectionHead eyebrow="Кейсы" copy="Результат измеряется не количеством генераций, а скоростью выхода на рынок.">От идеи до запуска — <em>за несколько дней</em></SectionHead><div className="case-grid">{cases.map((item, i) => <article className={`case-card ${item.theme}`} key={item.title}><div className="case-index">0{i+1} <span>{item.tag}</span></div><div><h3>{item.title}</h3><p>{item.text}</p></div><div className="case-stat"><strong>{item.stat}</strong><span>{item.label}</span></div></article>)}</div></section> }

function Metrics() { const items=[['5 мин','до первой версии'],['100%','соответствие бренду'],['78%','меньше правок'],['24/7','без очереди в продакшен']]; return <section id="metrics" className="metrics"><SectionHead eyebrow="Эффект">Больше материалов.<br/><em>Меньше операций.</em></SectionHead><div className="metric-grid">{items.map(([n,t])=><div className="metric" key={n}><strong>{n}</strong><span>{t}</span></div>)}</div><p className="metric-note">Средние показатели команд после 8 недель работы с платформой</p></section> }

function Testimonials() {
  const [items,setItems]=useState([]); const [active,setActive]=useState(0)
  useEffect(()=>{getTestimonials().then(setItems)},[])
  if(!items.length) return <section className="testimonials"><SectionHead eyebrow="Отзывы">Что говорят команды</SectionHead><div className="testimonial loading">Загружаем истории команд…</div></section>
  const item=items[active]
  return <section className="testimonials"><SectionHead eyebrow="Отзывы">Создано командами.<br/><em>Проверено брендом.</em></SectionHead><div className="testimonial"><div className="quote-mark">“</div><blockquote>{item.quote}</blockquote><div className="person"><div className="avatar">{item.initials}</div><div><strong>{item.name}</strong><span>{item.role}</span></div></div><div className="slider-controls"><span>{String(active+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button onClick={()=>setActive((active-1+items.length)%items.length)} aria-label="Предыдущий отзыв">←</button><button onClick={()=>setActive((active+1)%items.length)} aria-label="Следующий отзыв">→</button></div></div></section>
}

const plans=[
  {name:'Старт', desc:'Для одной маркетинговой команды', price:'от 49 000 ₽', features:['3 пользователя','1 дизайн-система','Сайты и изображения','Экспорт в HTML'], cta:'Попробовать'},
  {name:'Команда', desc:'Для растущего производства контента', price:'от 129 000 ₽', features:['15 пользователей','5 дизайн-систем','Все форматы контента','Роли и согласования','Приоритетная поддержка'], cta:'Запросить демо', popular:true},
  {name:'Контур', desc:'Для компаний с особыми требованиями', price:'По запросу', features:['Без ограничений','Private cloud / on-premise','Собственные AI-модели','SSO и аудит действий','Выделенная команда'], cta:'Обсудить проект'}
]
function Pricing(){return <section id="pricing"><SectionHead eyebrow="Тарифы" copy="Подберём конфигурацию под размер команды, процессы и требования безопасности.">Начните с команды.<br/><em>Масштабируйте на компанию.</em></SectionHead><div className="pricing-grid">{plans.map(p=><article className={`price-card ${p.popular?'popular':''}`} key={p.name}>{p.popular&&<span className="popular-label">Выбирают команды</span>}<div><h3>{p.name}</h3><p>{p.desc}</p></div><strong className="price">{p.price}</strong><ul>{p.features.map(f=><li key={f}>✓ <span>{f}</span></li>)}</ul><a className={`button ${p.popular?'':'outline'}`} href="#contact">{p.cta} <Arrow/></a></article>)}</div></section>}

function Contact(){
  const [form,setForm]=useState({name:'',email:'',company:'',size:''}); const [errors,setErrors]=useState({}); const [state,setState]=useState('idle'); const [requestId,setRequestId]=useState('')
  const validate=()=>{const e={}; if(!form.name.trim())e.name='Укажите имя'; if(!form.company.trim())e.company='Укажите компанию'; if(!/^\S+@\S+\.\S+$/.test(form.email))e.email='Введите корректный email'; return e}
  const submit=async(e)=>{e.preventDefault(); const found=validate(); setErrors(found); if(Object.keys(found).length)return; setState('loading'); try{const res=await submitLead(form);setRequestId(res.requestId);setState('success')}catch{setState('error')}}
  const field=(key,label,type='text')=><label><span>{label}</span><input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} aria-invalid={!!errors[key]}/>{errors[key]&&<small>{errors[key]}</small>}</label>
  return <section id="contact" className="contact"><div className="contact-copy"><span className="eyebrow light">Давайте знакомиться</span><h2>Покажем, как ваш бренд начинает <em>работать сам</em></h2><p>Оставьте контакты — проведём персональную демонстрацию на материалах вашей компании.</p><div className="contact-detail"><span>Ответим в течение рабочего дня</span><span>Демо займёт 30 минут</span></div></div><div className="form-wrap">{state==='success'?<div className="success"><div>✓</div><h3>Заявка принята</h3><p>Спасибо! Мы свяжемся с вами в течение рабочего дня.</p><small>Номер заявки: {requestId}</small><button className="button outline" onClick={()=>setState('idle')}>Отправить ещё одну</button></div>:<form onSubmit={submit} noValidate>{field('name','Ваше имя')}{field('email','Рабочий email','email')}{field('company','Компания')}<label><span>Размер команды</span><select value={form.size} onChange={e=>setForm({...form,size:e.target.value})}><option value="">Выберите вариант</option><option>1–10 человек</option><option>11–50 человек</option><option>Более 50 человек</option></select></label><button className="button submit" disabled={state==='loading'}>{state==='loading'?'Отправляем…':'Запросить демо'} <Arrow/></button>{state==='error'&&<p className="form-error">Не удалось отправить. Попробуйте ещё раз.</p>}<small className="legal">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</small></form>}</div></section>
}

function Footer(){return <footer><a className="logo inverse" href="#top"><span>снэп</span><b>билд</b></a><p>Платформа для создания маркетинговых материалов на основе дизайн-системы.</p><div className="footer-links"><a href="#cases">Кейсы</a><a href="#pricing">Тарифы</a><a href="mailto:hey@snapbuild.ru">hey@snapbuild.ru</a></div><span>© 2026 Снэпбилд</span></footer>}

function App(){return <><Header/><main><Hero/><Cases/><Metrics/><Testimonials/><Pricing/><Contact/></main><Footer/></>}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
