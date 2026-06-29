import logoNetline from "../assets/netline.jpg";

const footer = () => {
  return (
    <section className=" bg-blue-950 rounded-2xl">
     
      <div className=" grid grid-cols-1 md:grid-cols-3 ">
        <div className="">
          <img src={logoNetline} alt="Logotipo Netline" className="w-auto h-10" />
        </div>
     </div>

    </section>
  );
    
};

export default footer;
