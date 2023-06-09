import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import RECAPTCHA from "react-google-recaptcha";
import { useAccount } from "wagmi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { FiUploadCloud } from "react-icons/fi";
import { TbFileUpload } from "react-icons/tb";
import toast from "react-hot-toast";
import { ConnectWallet } from "@/components/Button/ConnectWallet";
import useWeb3Storage from "@/hooks/useWeb3Storage";
import { useRouter } from "next/router";
import EN from "@/constants/en";
import BR from "@/constants/br";
import RacotoContract from "@/constants/abis/abi.json";
import LanguageDropdown from "@/components/lists/LanguageDropdown";
import {
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";

type ContentProps = {
  username: string;
  wallet_address: `0x${string}` | undefined;
  land_image: File | null;
  ownership_certificate: File | null;
  boundary_certificate: File | null;
};

const Register = () => {
  const { address } = useAccount();
  const captchaRef = useRef(null);
  const router = useRouter();
  const { locale } = useRouter();
  const avatarRef = useRef<HTMLInputElement>(null);
  const ownershipCertificateRef = useRef<HTMLInputElement>(null);
  const boundaryCertificateRef = useRef<HTMLInputElement>(null);
  const [terms, setTerms] = useState<boolean>(false);
  const [landImage, setLandImage] = useState<string>();
  const [ownershipCertificateFile, setOwnershipCertificateFile] =
    useState<File | null>(null);
  const [boundaryCertificateFile, setBoundaryCertificateFile] =
    useState<File | null>(null);
  const [content, setContent] = useState<ContentProps>({
    username: "",
    wallet_address: address,
    land_image: null,
    ownership_certificate: null,
    boundary_certificate: null,
  });

  const { storeFile, getCid } = useWeb3Storage();

  const getTranslation = (locale: string) => {
    switch (locale) {
      case "br":
        return BR;
      default:
        return EN;
    }
  };
  const t = getTranslation(locale as string);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setContent({
      ...content,
      [name]: value,
    });
  };
  const checkFile = (file: File, fileTypes: string[], fileErr: string) => {
    const { size, type } = file;
    if (!fileTypes.includes(type)) {
      toast.error(fileErr);
      return false;
    }
    // Check file size to ensure it is less than 2MB.
    if (size / 1024 / 1024 > 2) {
      toast.error("File size exceeded the limit of 2MB");
      return false;
    }
    return true;
  };
  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (
      content.username === "" ||
      content.land_image === null ||
      content.ownership_certificate === null ||
      content.boundary_certificate === null
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    toast.loading("Uploading to IPFS...", {
      id: "uploading",
    });
    const ownership_certificate = await storeFile(
      content.ownership_certificate as File
    ).catch((err) => {
      toast.dismiss("uploading");
      toast.error("Error uploading ownership certificate");
      return;
    });
    const boundary_certificate = await storeFile(
      content.boundary_certificate as File
    ).catch((err) => {
      toast.dismiss("uploading");
      toast.error("Error uploading boundary certificate");
      return;
    });
    const land_image = await storeFile(content.land_image as File).catch(
      (err) => {
        toast.dismiss("uploading");
        toast.error("Error uploading land image");
        return;
      }
    );
    if (!ownership_certificate || !boundary_certificate || !land_image) {
      toast.dismiss("uploading");
      return;
    }
    const metadata = {
      username: content.username,
      wallet_address: address,
      land_image,
      ownership_certificate,
      boundary_certificate,
    };
    toast.dismiss("uploading");
    toast.success("Uploaded to IPFS");
    toast.loading("Establishing contract connection", {
      id: "connecting",
    });
    const metadataCid = await getCid(
      new File([JSON.stringify(metadata)], "metadata.json", {
        type: "application/json",
      })
    );
    console.log(metadataCid);
    toast.dismiss("connecting");
    toast.loading("Connecting with contract", {
      id: "connect",
    });
    try {
      const { request, result } = await prepareWriteContract({
        address: RacotoContract.address as `0x${string}`,
        abi: RacotoContract.abi,
        functionName: "register",
        args: [metadataCid],
      });

      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      toast.dismiss("connect");
      toast.success("Successfully registered");
      toast.custom("You'll be notified once approved", {
        icon: "ℹ️",
      });
    } catch (err) {
      toast.dismiss("connect");
      console.error(err);
      toast.error("Error connecting with contract");
    }
  };

  const checkWhitlisted = async (address: `0x${string}`) => {
    const data = await readContract({
      address: RacotoContract.address as `0x${string}`,
      abi: RacotoContract.abi,
      functionName: "isUserWhitelisted",
      args: [address],
    });
    if (data) {
      toast("You're already whitelisted", {
        icon: "ℹ️",
      });
      router.push("/");
    }
  };
  if (address) {
    checkWhitlisted(address);
  }

  return (
    <div className="w-full h-screen overflow-y-scroll bg-[#F5F5F5] font-recoleta">
      <nav className="w-full h-[50px] md:h-[80px] bg-white flex justify-between items-center">
        <Wrapper className="h-[60px] bg-white flex justify-between items-center text-xl py-3 ">
          <Link href={"/"}>
            <Image
              src="/assets/logo.png"
              alt="logo"
              width="200"
              height={200}
              className="w-14 h-14"
            />
          </Link>
          <section className="flex">
            <LanguageDropdown className={"text-black/[0.8]"} />
            <ConnectWallet />
          </section>
        </Wrapper>
      </nav>
      <Wrapper className="">
        <div className="w-[82%]  mx-auto my-10">
          <Wrapper className="bg-white rounded-xl py-5">
            <h1 className="text-2xl font-bold my-5 mb-8 font-proxima lg:text-3xl">
              {t.register_title}
            </h1>
            {/* Create Brand Form  */}
            <form className="w-[70%]">
              <label>
                <h3 className="text-base font-semibold my-1 lg:text-lg">
                  {t.register_input_wallet}
                </h3>
              </label>
              <input
                type="text"
                name="wallet_address"
                className="border border-[#CFCFCF] text-[#747373] my-2 mb-7 p-3 rounded-lg w-full outline-none text-lg"
                placeholder={t.register_input_wallet_placeholder}
                value={address}
                disabled
              />
              <label>
                <h3 className="text-base font-semibold my-1 lg:text-lg">
                  {t.register_input_username}
                </h3>
              </label>
              <input
                type="text"
                className="border border-[#CFCFCF] my-2 mb-7 p-3 rounded-lg w-full outline-none text-lg"
                name="username"
                onChange={handleOnChange}
                placeholder={t.register_input_username_placeholder}
              />
              <label>
                <h3 className="text-base font-semibold my-1 lg:text-lg">
                  {t.register_input_land_image}
                </h3>
              </label>

              <div className="relative my-4 flex aspect-video w-[45%] items-center justify-center rounded-xl border-2 border-dashed  border-[#CFCFCF] text-slate-400 ">
                <input
                  type="file"
                  ref={avatarRef}
                  onChange={() => {
                    const file = avatarRef!.current!.files![0];
                    if (!file) {
                      setLandImage("");
                      return;
                    }
                    const isValid = checkFile(
                      file,
                      ["image/png", "image/jpg", "image/jpeg"],
                      "File format must be either png or jpg"
                    );
                    if (!isValid) return;
                    setContent({
                      ...content,
                      land_image: file,
                    });
                    const reader = new FileReader();
                    if (file) {
                      reader.readAsDataURL(file);
                    }
                    reader.onload = (readerEvent) => {
                      setLandImage(readerEvent!.target!.result!.toString());
                    };
                  }}
                  hidden
                  name="land_image"
                  id="land_image"
                />
                {!landImage && (
                  <button
                    type="button"
                    onClick={() => avatarRef!.current!.click()}
                    className="flex flex-col justify-center rounded-full p-4 text-center text-base text-black/[0.7] font-semibold transition duration-300 "
                  >
                    <FiUploadCloud className="h-4 w-4 mx-auto lg:w-5 lg:h-5" />
                    <h2 className="lg:text-base font-proxima">
                      {t.register_input_land_image_placeholder}
                    </h2>
                  </button>
                )}
                {landImage && (
                  <>
                    <Image
                      src={landImage}
                      alt="profile-picture"
                      width={200}
                      height={200}
                      className="h-full aspect-auto rounded-xl "
                    />
                    <button
                      type="button"
                      onClick={() => setLandImage("")}
                      className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 text-xs lg:text-sm text-white"
                    >
                      {t.register_reset_btn}
                    </button>
                  </>
                )}
              </div>
              <label>
                <h3 className="text-base font-semibold my-1 lg:text-lg">
                  {t.register_input_certificate}
                </h3>
              </label>
              <div className="flex justify-between w-full">
                <div className="relative my-4 flex aspect-video w-[45%] items-center justify-center rounded-xl border-2 border-dashed  border-[#CFCFCF] text-slate-400 ">
                  <input
                    type="file"
                    ref={ownershipCertificateRef}
                    onChange={() => {
                      const file = ownershipCertificateRef!.current!.files![0];
                      if (!file) {
                        setOwnershipCertificateFile(null);
                        return;
                      }
                      const isValid = checkFile(
                        file,
                        ["application/pdf"],
                        "Pdf file format is required"
                      );
                      if (!isValid) return;

                      setContent({
                        ...content,
                        ownership_certificate: file,
                      });
                      setOwnershipCertificateFile(file);
                    }}
                    hidden
                    name="certificate"
                    id="certificate"
                  />
                  {!ownershipCertificateFile && (
                    <button
                      type="button"
                      onClick={() => ownershipCertificateRef!.current!.click()}
                      className="flex justify-center rounded-full p-4 text-center text-base text-black/[0.7] font-semibold transition duration-300"
                    >
                      <TbFileUpload className="h-4 w-4 my-auto mr-1 lg:w-5 lg:h-5 " />
                      <h2 className="lg:text-base font-proxima">
                        {t.register_input_ownership_certificate_placeholder}
                      </h2>
                    </button>
                  )}
                  {ownershipCertificateFile && (
                    <>
                      <div>
                        <BsFileEarmarkPdf className="h-10 w-10 my-auto mr-1" />
                        <h2>{ownershipCertificateFile.name}</h2>
                        <button
                          type="button"
                          onClick={() => setOwnershipCertificateFile(null)}
                          className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 lg:text-sm text-xs text-white"
                        >
                          {t.register_reset_btn}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative my-4 flex aspect-video w-[45%] items-center justify-center rounded-xl border-2 border-dashed  border-[#CFCFCF] text-slate-400 ">
                  <input
                    type="file"
                    ref={boundaryCertificateRef}
                    onChange={() => {
                      const file = boundaryCertificateRef!.current!.files![0];
                      if (!file) {
                        setBoundaryCertificateFile(null);
                        return;
                      }
                      const isValid = checkFile(
                        file,
                        ["application/pdf"],
                        "Pdf file format is required"
                      );
                      if (!isValid) return;

                      setContent({
                        ...content,
                        boundary_certificate: file,
                      });
                      setBoundaryCertificateFile(file);
                    }}
                    hidden
                    name="certificate"
                    id="certificate"
                  />
                  {!boundaryCertificateFile && (
                    <button
                      type="button"
                      onClick={() => boundaryCertificateRef!.current!.click()}
                      className="flex justify-center rounded-full p-4 text-center text-base text-black/[0.7] font-semibold transition duration-300"
                    >
                      <TbFileUpload className="h-4 w-4 my-auto mr-1 lg:w-5 lg:h-5 " />
                      <h2 className="lg:text-base font-proxima">
                        {t.register_input_boundary_certificate_placeholder}
                      </h2>
                    </button>
                  )}
                  {boundaryCertificateFile && (
                    <>
                      <div>
                        <BsFileEarmarkPdf className="h-10 w-10 my-auto mr-1" />
                        <h2>{boundaryCertificateFile.name}</h2>
                        <button
                          type="button"
                          onClick={() => setBoundaryCertificateFile(null)}
                          className="absolute right-2 lg:text-sm  top-2 rounded-lg bg-red-500 px-2 text-xs text-white"
                        >
                          {t.register_reset_btn}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <RECAPTCHA
                className="my-7"
                sitekey={process.env.NEXT_PUBLIC_SITE_KEY!}
                ref={captchaRef}
              />

              <div className="flex my-6 mx-2">
                <input
                  type="checkbox"
                  name="terms"
                  className="rounded-lg  mr-2 outline-none w-4 h-4 my-auto"
                  onChange={(e) => {
                    e.target.checked ? setTerms(true) : setTerms(false);
                  }}
                />
                <h2 className="lg:text-lg text-base  font-proxima">
                  {t.register_terms}
                </h2>
              </div>

              <button
                type="submit"
                className="bg-[#6ac61f] mb-5 rounded-xl text-white px-5 py-2 duration-300 hover:scale-95 min-w-fit w-[120px] font-normal font-proxima lg:text-lg"
                onClick={handleRegister}
              >
                {t.register_submit_btn}
              </button>
            </form>
            {/* Create Brand Form End */}
          </Wrapper>
        </div>
      </Wrapper>
    </div>
  );
};

export default Register;
