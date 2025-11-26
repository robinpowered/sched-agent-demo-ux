import svgPaths from "./svg-sebae6k50y";

export default function EzCaterAvatar() {
  return (
    <div className="bg-[#00B377] relative rounded-[100px] size-full" data-name="EzCaterAvatar">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[7px] relative size-full">
          <div className="flex items-center justify-center">
            <svg className="block h-[14px] w-auto" fill="none" viewBox="0 0 64 35">
              <g clipPath="url(#clip0_2002_119)">
                <path d={svgPaths.p153f5700} fill="white" />
                <path d={svgPaths.p2542cc80} fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_2002_119">
                  <rect fill="white" height="35" width="64" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
