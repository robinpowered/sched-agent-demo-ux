import svgPaths from "./svg-2f9yr5tjal";

function Icon() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.551px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p388ee280} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p31be1e00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p2672dd00} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p30489000} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.pa06380} fill="var(--fill-0, white)" id="Vector_5" />
          <path d={svgPaths.p36db1c00} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.p2ec4780} fill="var(--fill-0, white)" id="Vector_7" />
          <path d={svgPaths.p2d6c4700} fill="var(--fill-0, white)" id="Vector_8" />
          <path d={svgPaths.pfa2ef00} fill="var(--fill-0, white)" id="Vector_9" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Logo">
      <Icon />
    </div>
  );
}

export default function Avatar() {
  return (
    <div className="bg-[#a81f6b] relative rounded-[100px] size-full" data-name="Avatar">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[7px] relative size-full">
          <Logo />
        </div>
      </div>
    </div>
  );
}