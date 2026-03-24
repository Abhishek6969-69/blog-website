import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Appbar from "../components/Appbar";
import { BACKEND_URL } from "../components/config";

const Landingpg = () => {
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    const demoToastId = toast.loading("Signing you in with demo account...");
    try {
      const demoCredentials = { email: "garvit@gmail.com", password: "123456789" };
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, demoCredentials);
      if (response.data.jwt) {
        const token = `Bearer ${response.data.jwt}`;
        localStorage.setItem("token", token);
        const userResponse = await axios.get(`${BACKEND_URL}/api/v1/user/getloggedinuser`, {
          headers: { Authorization: token },
        });
        if (userResponse.data?.users) {
          localStorage.setItem("user", JSON.stringify(userResponse.data.users));
        }
        toast.dismiss(demoToastId);
        toast.success("Welcome! You're now signed in.");
        navigate("/landingpage");
      } else {
        throw new Error("No JWT token received");
      }
    } catch (error) {
      toast.dismiss(demoToastId);
      let errorMessage = "Demo account unavailable. Please try signing up instead.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.response?.data?.error || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ━━━ 1. NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Appbar />

      {/* ━━━ 2. HERO — short powerful statement + CTA ━━━━━━━━━━ */}
      <section className="relative bg-[#f9f9f8] border-t border-gray-100 overflow-hidden">

        {/* dot grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle,#d1d5db 1px,transparent 1px)", backgroundSize: "28px 28px", opacity: 0.4 }} />
        {/* centre glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%,rgba(255,255,255,0.95) 0%,transparent 100%)" }} />

        <div className="relative w-full px-5 sm:px-8 pt-16 lg:pt-24 pb-0">
          <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

            {/* LEFT — copy */}
            <div className="text-left pb-12 lg:pb-20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500 mb-7 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                10,000+ writers already publishing
              </div>

              <h1 className="text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] font-extrabold text-gray-950 tracking-[-0.04em] leading-[1.05] mb-5">
                Your ideas<br />deserve to be<br />
                <span className="relative inline-block">
                  read.
                  <svg aria-hidden="true" viewBox="0 0 80 10" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none">
                    <path d="M2 7 Q 40 1, 78 7" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                Write Wave is the writing platform for thinkers, creators, and experts who want to share their ideas and grow a real audience — without the noise.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 bg-gray-950 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Start Writing Free →
                </button>
                <button
                  onClick={handleDemoSignIn}
                  disabled={isDemoLoading}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-600 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDemoLoading && (
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Try Demo
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">No credit card required · Free forever plan available</p>
            </div>

            {/* RIGHT — product visual mockup */}
            <div className="hidden lg:block pb-0 relative">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60 overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 bg-gray-200 rounded-full h-4 max-w-[160px]" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-900 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                  <div className="mt-4 h-24 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">Cover Image</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="flex gap-2 pt-2">
                    <div className="px-4 py-1.5 bg-gray-950 rounded-full text-white text-xs font-medium">Publish</div>
                    <div className="px-4 py-1.5 bg-gray-100 rounded-full text-gray-500 text-xs font-medium">Save Draft</div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 bottom-16 bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
                <div className="text-lg font-bold text-gray-900">1M+</div>
                <div className="text-xs text-gray-400">Monthly Readers</div>
              </div>
              <div className="absolute -right-4 top-12 bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
                <div className="text-lg font-bold text-gray-900">50K+</div>
                <div className="text-xs text-gray-400">Articles Published</div>
              </div>
            </div>
          </div>
        </div>

        {/* scrolling marquee */}
        <div className="border-t border-gray-100 bg-white overflow-hidden py-3 select-none">
          <div className="flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-10 pr-10 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                <span>✦ Write</span><span>✦ Publish</span><span>✦ Inspire</span>
                <span>✦ Explore</span><span>✦ Connect</span><span>✦ Grow</span>
                <span>✦ Create</span><span>✦ Share</span><span>✦ Discover</span>
              </span>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-25%)}}`}</style>
      </section>

      {/* ━━━ 3. SOCIAL PROOF ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-t border-gray-100 bg-white">
        <div className="w-full px-5 sm:px-8 py-12">
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-8">
            Trusted by writers across the globe
          </p>
          <div className="flex flex-wrap justify-center gap-y-6 divide-x divide-gray-100">
            {[
              { value: "10K+", label: "Active Writers" },
              { value: "50K+", label: "Articles Published" },
              { value: "1M+",  label: "Monthly Readers" },
              { value: "150+", label: "Countries Reached" },
              { value: "4.9★", label: "Avg. Writer Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center px-8 sm:px-12">
                <div className="text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
                <div className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 4. ABOUT SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-t border-gray-100 bg-[#f9f9f8]">
        <div className="w-full px-5 sm:px-8 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* visual */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[4/3] flex items-end p-8 order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
              <div className="absolute inset-0 p-6 flex flex-col gap-3 justify-center">
                {[
                  { title: "The Future of AI in Everyday Life", author: "Alex J.", reads: "12.4K reads" },
                  { title: "How I Built a 50K Newsletter", author: "Sarah C.", reads: "8.1K reads" },
                  { title: "10 Habits of Great Writers", author: "Michael R.", reads: "21K reads" },
                ].map((post, i) => (
                  <div
                    key={post.title}
                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                    style={{ opacity: 1 - i * 0.15 }}
                  >
                    <div className="min-w-0">
                      <div className="text-white text-xs font-semibold truncate">{post.title}</div>
                      <div className="text-white/50 text-[11px] mt-0.5">{post.author}</div>
                    </div>
                    <div className="text-[11px] text-white/40 whitespace-nowrap">{post.reads}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* copy */}
            <div className="order-1 lg:order-2">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">About Write Wave</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight leading-tight mb-5">
                Built for writers<br />who mean it.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-5">
                Write Wave was built for one reason: to give serious writers a clean, focused space to publish their best work — and reach people who actually want to read it.
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                No algorithm games. No follower counts. Just your words, a powerful editor, and an audience that grows through quality.
              </p>
              <button
                onClick={() => navigate("/blogs")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900 hover:underline underline-offset-4 transition-all"
              >
                Read our top stories →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 5. KEY FEATURES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-t border-gray-100 bg-white">
        <div className="w-full px-5 sm:px-8 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Why writers choose us</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
                Everything you need,<br />nothing you don't.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden mb-6">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
                  title: "Distraction-free Editor",
                  desc: "A clean, fast editor built for deep focus — with rich formatting, images, and code blocks when you need them.",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                  title: "Real Analytics",
                  desc: "See who's reading, where they came from, and how they engage — with data that actually helps you improve.",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
                  title: "Genuine Community",
                  desc: "Connect with readers who follow topics, not just people. Build a real audience one great article at a time.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white p-8 group hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gray-200 transition-colors">
                    <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      {icon}
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { emoji: "⚡", title: "Lightning Fast", desc: "Optimised globally — pages load in under a second, anywhere." },
                { emoji: "🔒", title: "Secure & Private", desc: "Enterprise-grade security. Your content, always yours." },
                { emoji: "❤️", title: "Reader Engagement", desc: "Likes, comments, saves — real signals from real readers." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="flex gap-4 items-start p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <span className="text-xl leading-none mt-0.5">{emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 6. LEAD MAGNET — dark, punchy, stand-out CTA ━━━━━━━ */}
      <section className="border-t border-gray-100 bg-gray-950">
        <div className="w-full px-6 sm:px-12 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">Free to start</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">
                Publish your first<br />article today.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Sign up free, open the editor, and hit publish in under 5 minutes. No setup, no friction — just your ideas out in the world.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 bg-white text-gray-950 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Create Free Account →
                </button>
                <button
                  onClick={handleDemoSignIn}
                  disabled={isDemoLoading}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-gray-400 text-sm font-medium border border-gray-700 rounded-full hover:border-gray-500 hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  {isDemoLoading && (
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Preview with Demo
                </button>
              </div>
            </div>
            {/* editor mockup */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Write Wave Editor</span>
                </div>
                <div className="h-4 bg-white/20 rounded w-2/3" />
                <div className="space-y-2 pt-1">
                  <div className="h-2.5 bg-white/10 rounded w-full" />
                  <div className="h-2.5 bg-white/10 rounded w-5/6" />
                  <div className="h-2.5 bg-white/10 rounded w-4/6" />
                </div>
                <div className="border border-white/10 rounded-xl p-4 mt-3 space-y-2">
                  <div className="h-2.5 bg-white/10 rounded w-full" />
                  <div className="h-2.5 bg-white/10 rounded w-5/6" />
                  <div className="h-2.5 bg-white/10 rounded w-3/4" />
                </div>
                <div className="flex justify-end pt-2">
                  <div className="px-4 py-1.5 bg-white rounded-full text-gray-950 text-xs font-bold">Publish Now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 7. CONTENT SECTION — trending articles + testimonials ━━━ */}
      <section className="border-t border-gray-100 bg-[#f9f9f8]">
        <div className="w-full px-6 sm:px-12 lg:px-24 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">From the community</p>
                <h2 className="text-3xl font-bold text-gray-950 tracking-tight">Trending on Write Wave</h2>
              </div>
              <button
                onClick={() => navigate("/blogs")}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline-offset-4 hover:underline whitespace-nowrap"
              >
                See all stories →
              </button>
            </div>

            {/* article cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { tag: "Technology", title: "The Future of AI in Everyday Life",        author: "Alex Johnson", read: "5 min read", avatar: "AJ" },
                { tag: "Growth",     title: "How I Built a 50K Newsletter From Scratch", author: "Sarah Chen",   read: "8 min read", avatar: "SC" },
                { tag: "Writing",    title: "10 Habits That Separate Great Writers",     author: "Michael R.",   read: "4 min read", avatar: "MR" },
              ].map(({ tag, title, author, read, avatar }) => (
                <div
                  key={title}
                  onClick={() => navigate("/blogs")}
                  className="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:shadow-gray-100 hover:border-gray-200 transition-all group"
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    {tag}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-4 group-hover:text-gray-600 transition-colors">
                    {title}
                  </h3>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-[10px]">
                      {avatar}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-700">{author}</div>
                      <div className="text-[11px] text-gray-400">{read}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {[
                { initials: "AJ", name: "Alex Johnson", role: "Tech Writer",       quote: "The editor is incredibly intuitive. I grew my readership by 300% in 6 months." },
                { initials: "SC", name: "Sarah Chen",   role: "Lifestyle Blogger", quote: "Finally a platform that puts writers first. The analytics are genuinely useful." },
                { initials: "MR", name: "Michael R.",   role: "Business Author",   quote: "The best writing platform I've used. Clean, fast, and the community is real." },
              ].map(({ initials, name, role, quote }) => (
                <div key={name} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:shadow-gray-100 transition-shadow">
                  <div className="flex gap-0.5 text-yellow-400 text-xs">★★★★★</div>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 italic">"{quote}"</p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
                    <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 leading-none">{name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 8. FOOTER — logo + secondary nav + legal ━━━━━━━━━━ */}
      <footer className="border-t border-gray-100 bg-gray-950">
        <div className="w-full px-6 sm:px-12 lg:px-24 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-white tracking-tight">Write Wave</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Where ideas come to life. The writing platform for thinkers and creators worldwide.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-white text-gray-950 text-xs font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                Start Writing Free
              </button>
            </div>

            {[
              { heading: "Platform",  links: ["Write", "Read", "Explore", "Community"] },
              { heading: "Resources", links: ["Help Center", "Writing Guide", "API Docs", "Blog"] },
              { heading: "Company",   links: ["About", "Careers", "Privacy", "Terms"] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{heading}</h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Write Wave. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landingpg;