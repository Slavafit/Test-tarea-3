import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import originalMarkup from './original/markup.html?raw'
import { getTestimonials } from './services/testimonialsService'
import { getUseCases } from './services/useCasesService'
import { submitLead } from './services/leadService'
import './original/inline.css'
import './extensions.css'

const base = import.meta.env.BASE_URL
const markup = originalMarkup
  .replaceAll('assets/', `${base}assets/`)
  .replaceAll('href="/"', `href="${base}"`)

const OriginalSite = React.memo(function OriginalSite() {
  return <div className="original-site" dangerouslySetInnerHTML={{ __html: markup }} />
})

function SectionHeader({ title, description }) {
  return <header className="ext-head"><h2>{title}</h2>{description && <p>{description}</p>}</header>
}

function UseCasesExtension() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getUseCases().then((data) => { setItems(data); setStatus('data') }).catch(() => setStatus('error'))
  }, [])

  const item = items[active]
  return <section className="ext-section ext-cases" id="business-cases">
    <SectionHeader title="Кейсы использования" description="Одна платформа — разные задачи команд" />
    {status === 'loading' && <div className="ext-state">Загружаем кейсы…</div>}
    {status === 'error' && <div className="ext-state">Не удалось загрузить кейсы</div>}
    {item && <>
      <div className="ext-tabs" role="tablist">{items.map((entry, index) => <button role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry.id}>{entry.tab}</button>)}</div>
      <article className="ext-case-card" key={item.id}>
        <div><span className="ext-number">0{active + 1} / 04</span><h3>{item.title}</h3><p>{item.text}</p></div>
        <ul>{item.points.map((point) => <li key={point}><span>↗</span>{point}</li>)}</ul>
        <div className="ext-case-metric"><strong>{item.metric}</strong><span>{item.metricLabel}</span></div>
      </article>
    </>}
  </section>
}

function MetricsExtension() {
  const metrics = [['5 минут', 'до первой версии'], ['100%', 'соответствие дизайн-системе'], ['78%', 'меньше ручных правок'], ['×6', 'больше материалов']]
  return <section className="ext-section ext-metrics" id="results"><SectionHeader title="Результат, который можно измерить" /><div className="ext-metric-grid">{metrics.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div><small>Средние показатели команд после внедрения платформы</small></section>
}

function ReviewsExtension() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState('loading')
  const [retry, setRetry] = useState(0)
  useEffect(() => { setStatus('loading'); getTestimonials().then((data) => { setItems(data); setStatus('data') }).catch(() => setStatus('error')) }, [retry])
  const item = items[active]
  return <section className="ext-section ext-reviews" id="reviews"><SectionHeader title="Команды о работе со Снэпбилдом" description="Результат виден не в количестве генераций, а в скорости выхода на рынок" />
    {status === 'loading' && <div className="ext-state">Загружаем отзывы…</div>}
    {status === 'error' && <div className="ext-state">Не удалось загрузить отзывы <button onClick={() => setRetry(retry + 1)}>Повторить</button></div>}
    {item && <article className="ext-review" key={item.id}><blockquote>«{item.quote}»</blockquote><footer><div className="ext-avatar">{item.initials}</div><div><b>{item.name}</b><span>{item.role}</span></div><nav><small>{active + 1} / {items.length}</small><button aria-label="Предыдущий отзыв" onClick={() => setActive((active - 1 + items.length) % items.length)}>←</button><button aria-label="Следующий отзыв" onClick={() => setActive((active + 1) % items.length)}>→</button></nav></footer></article>}
  </section>
}

const plans = [
  { name: 'Команда', month: 49000, year: 470000, text: 'Для одного отдела маркетинга', features: ['До 5 пользователей', '1 дизайн-система', 'Сайты и изображения'] },
  { name: 'Бизнес', month: 129000, year: 1238000, text: 'Для производства контента в масштабе', features: ['До 25 пользователей', 'Все форматы', 'Роли и согласования'], popular: true },
  { name: 'Контур', month: null, year: null, text: 'Для корпоративной инфраструктуры', features: ['Без ограничений', 'Private cloud / on-premise', 'Собственные модели и SSO'] },
]

function PricingExtension() {
  const [period, setPeriod] = useState('month')
  const price = (plan) => plan[period] ? `${plan[period].toLocaleString('ru-RU')} ₽` : 'По запросу'
  return <section className="ext-section ext-pricing" id="pricing"><SectionHeader title="Тарифы под ваши задачи" description="При оплате за год два месяца работы включены в стоимость" /><div className="ext-billing"><button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>Месяц</button><button className={period === 'year' ? 'active' : ''} onClick={() => setPeriod('year')}>Год <span>−20%</span></button></div><div className="ext-plans">{plans.map((plan) => <article className={plan.popular ? 'popular' : ''} key={plan.name}>{plan.popular && <small className="ext-badge">Популярный</small>}<h3>{plan.name}</h3><p>{plan.text}</p><strong>{price(plan)}{plan[period] && <small> / {period === 'month' ? 'месяц' : 'год'}</small>}</strong><ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><a href="#lead-form">{plan.name === 'Контур' ? 'Обсудить проект' : 'Запросить демо'}</a></article>)}</div></section>
}

function LeadFormExtension() {
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const submit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Укажите имя'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Введите корректный email'
    if (!form.company.trim()) next.company = 'Укажите компанию'
    setErrors(next)
    if (Object.keys(next).length) return
    setStatus('loading')
    try { await submitLead(form); setStatus('success') } catch { setStatus('error') }
  }
  const field = (name, label, type = 'text') => <label>{label}<input type={type} value={form[name]} aria-invalid={Boolean(errors[name])} onChange={(event) => setForm({ ...form, [name]: event.target.value })} />{errors[name] && <small>{errors[name]}</small>}</label>
  return <section className="ext-section ext-lead" id="lead-form"><SectionHeader title="Посмотрим на задачи вашей команды" description="Проведём демонстрацию на материалах вашей компании" /><div className="ext-form-box">{status === 'success' ? <div className="ext-success"><b>✓</b><h3>Заявка принята</h3><p>Свяжемся с вами в течение рабочего дня.</p><button onClick={() => setStatus('idle')}>Отправить ещё одну</button></div> : <form onSubmit={submit} noValidate>{field('name', 'Ваше имя')}{field('email', 'Рабочий email', 'email')}{field('company', 'Компания')}<button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Отправляем…' : 'Запросить демо'}</button>{status === 'error' && <small>Не удалось отправить. Попробуйте ещё раз.</small>}<p>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p></form>}</div></section>
}

function OriginalScripts() {
  useEffect(() => {
    document.documentElement.classList.add('hero-motion-pending')
    const nodes = []
    const load = (src) => new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = `${base}assets/js/${src}`
      script.type = 'module'
      script.onload = resolve
      script.async = false
      document.body.appendChild(script)
      nodes.push(script)
    })
    load('hero-motion.js').then(() => load('85e547ee71f164c7.js'))
    return () => nodes.forEach((node) => node.remove())
  }, [])
  return null
}

function ScrollReveal({ ready }) {
  useLayoutEffect(() => {
    if (!ready) return undefined

    const sections = [
      ['#process', '.dds-steps-header, .dds-steps-card'],
      ['#use-cases', '.dds-tabs-inner'],
      ['#compare', '.dds-benefit-header, .dds-benefit-scroll'],
      ['#features', '.dds-why-safe-section-title, .dds-why-safe-point'],
      ['#roadmap', '.dds-rmap-header, .dds-rmap-scroller'],
      ['#faq', '.dds-accordion-header, .dds-accordion-col'],
      ['#cta', '.dds-launch-content'],
    ]
    const items = []

    sections.forEach(([sectionSelector, itemSelector]) => {
      const section = document.querySelector(sectionSelector)
      section?.querySelectorAll(itemSelector).forEach((item, index) => {
        item.classList.add('scroll-reveal-item')
        item.style.setProperty('--reveal-delay', `${Math.min(index * 80, 240)}ms`)
        items.push(item)
      })
    })

    const groups = Array.from(document.querySelectorAll('.ext-section'))
    groups.forEach((group) => group.classList.add('scroll-reveal-group'))
    const observed = [...items, ...groups]
    document.documentElement.classList.add('scroll-reveal-enabled')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      observed.forEach((item) => item.classList.add('is-revealed'))
      return () => document.documentElement.classList.remove('scroll-reveal-enabled')
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    observed.forEach((item) => observer.observe(item))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('scroll-reveal-enabled')
    }
  }, [ready])

  return null
}

function App() {
  const [targets, setTargets] = useState(null)
  useEffect(() => {
    const make = (id) => { const node = document.createElement('div'); node.id = id; return node }
    const cases = make('react-cases')
    const metrics = make('react-metrics')
    const reviews = make('react-reviews')
    const pricing = make('react-pricing')
    const lead = make('react-lead')
    document.querySelector('#use-cases')?.after(cases)
    document.querySelector('#compare')?.after(metrics)
    document.querySelector('#roadmap')?.after(reviews)
    reviews.after(pricing)
    document.querySelector('#cta')?.before(lead)
    setTargets({ cases, metrics, reviews, pricing, lead })
    return () => [cases, metrics, reviews, pricing, lead].forEach((node) => node.remove())
  }, [])

  return <>
    <OriginalSite />
    <OriginalScripts />
    {targets && <>{createPortal(<UseCasesExtension />, targets.cases)}{createPortal(<MetricsExtension />, targets.metrics)}{createPortal(<ReviewsExtension />, targets.reviews)}{createPortal(<PricingExtension />, targets.pricing)}{createPortal(<LeadFormExtension />, targets.lead)}</>}
    <ScrollReveal ready={Boolean(targets)} />
  </>
}

createRoot(document.getElementById('root')).render(<App />)
