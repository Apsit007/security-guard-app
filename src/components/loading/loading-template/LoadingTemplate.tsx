import "../Loading.scss";


const LoadingTemplate = () => {
  return (
    <div className="flex flex-col items-center">
      
      <img src="/logo.png" alt="Logo" className="w-[400x] h-[300px]" />

      <div className="flex w-full justify-end items-start">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTemplate;
