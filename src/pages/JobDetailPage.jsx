import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import api from "../axios/api";
import { Disclosure } from "@headlessui/react";

export default function JobDetailPage() {
  const { id_job } = useParams();
  const { isLoggedIn, role } = useContext(AuthContext);
  const [alreadyApply, setAlreadyApply] = useState(false);
  const userId = localStorage.getItem("userId");
  const [job, setJob] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function getJob() {
      try {
        const response = await api.get(`/job/${id_job}`);
        const { candidates } = response.data;

        setJob(response.data);

        const candidateInJob = candidates.find(
          (candidate) => candidate._id === userId
        );

        setAlreadyApply(!!candidateInJob);
      } catch (error) {
        console.log(error);
      }
    }

    getJob();
  }, [id_job, userId]);

  async function handleApply() {
    try {
      await api.post(`/job/apply/${id_job}`);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleApprove(id_user) {
    try {
      // /job/approved-candidate/:id_job/:id_user

      const response = await api.post(
        `/job/approved-candidate/${id_job}/${id_user}`
      );
      console.log(response);
      navigate("/profile-business");
    } catch (error) {
      console.log(error);
    }
  }
  console.log(job);
  return (
    <>
      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <h1 className="text-2xl font-semibold">{job.title}</h1>
        <p className="text-sm">
          Local: {job.city}, {job.state}
        </p>
        <p className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          {job.model}
        </p>
        <pre className="mt-4 whitespace-pre-line font-sans">
          {job.description}
        </pre>
        <p className="mt-2">Salário: R$ {job.salary}</p>
        <p className="mt-2">Status: {job.status}</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Empresa</h2>
          <p className="text-sm">{job.business?.name}</p>
          <p className="text-sm">{job.business?.description}</p>
          <p className="text-sm">
            Contato: {job.business?.email}, {job.business?.telefone}
          </p>
        </div>

        {role === "USER" && (
          <>
            {alreadyApply ? (
              <button
                className="mt-4 bg-gray-300 p-4 py-2 rounded-lg text-gray-600 cursor-not-allowed"
                disabled
              >
                Já se Candidatou
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="mt-4 bg-indigo-500 p-4 py-2 rounded-lg text-white hover:bg-indigo-600"
              >
                Me Candidatar
              </button>
            )}
          </>
        )}
      </div>

      <div>
        {userId === job.business?._id && (
          <div className="border rounded-lg shadow-sm p-4 bg-white mt-4">
            {/* INFOS QUE SÓ PODERAO SER VISTAS PELO DONO D AVAGA  */}
            {job.select_candidate && (
              <h1>Candidato selecionado: {job.select_candidate.name}</h1>
            )}
            <h1 className="text-2xl font-semibold text-center mb-4">
              Candidatos
            </h1>
            {job.candidates?.map((candidate) => (
              <Disclosure key={candidate._id}>
                <Disclosure.Button className="flex w-full justify-between bg-gray-50 p-2 rounded-lg items-center">
                  <p>{candidate.name}</p> <p>{candidate.email}</p>{" "}
                  <p>{candidate.telefone}</p>
                  {/* PARA FAZER O BOTÃO SUMIR QUANDO O CANDIDATO FOR SELECIONADO  */}
                  {!job.select_candidate && (
                    <button
                      onClick={() => handleApprove(candidate._id)}
                      className="bg-indigo-500 px-4 py-2 mt-2 text-center text-white rounded-lg shadow-lg hover:bg-indigo-400"
                    >
                      Selecionar Candidato
                    </button>
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 mt-2 bg-gray-50 p-4 rounded-lg">
                  {candidate.curriculo ? (
                    <pre className="mt-4 whitespace-pre-line font-sans">
                      {" "}
                      {candidate.curriculo}
                    </pre>
                  ) : (
                    "Candidato não tem currículo"
                  )}
                </Disclosure.Panel>
              </Disclosure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
