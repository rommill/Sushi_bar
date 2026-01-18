export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">О нашем баре</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Свежие ингредиенты</h3>
            <p>Ежедневная доставка рыбы</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Японские шефы</h3>
            <p>Опытные повара из Токио</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Быстрая доставка</h3>
            <p>За 60 минут в любую точку</p>
          </div>
        </div>
      </div>
    </section>
  );
}
