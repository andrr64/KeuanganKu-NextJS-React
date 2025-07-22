'use client';

import { Progress } from "@/components/ui/Progress";
import { FaBullseye, FaPlus, FaTrash } from "react-icons/fa";
import { FaRegClipboard } from "react-icons/fa6";

interface GoalData {
  id: string;
  nama: string;
  target: number;
  terkumpul: number;
  tanggalTarget: string;
}

interface Props {
  goals?: GoalData[];
  onHapus?: (goalId: string) => void;
  onTambahUang?: (goalId: string) => void;
}

const dummyGoals: GoalData[] = [
  {
    id: "1",
    nama: "Beli Laptop Baru",
    target: 10000000,
    terkumpul: 4000000,
    tanggalTarget: "2025-12-01",
  },
  {
    id: "2",
    nama: "Dana Liburan Bali",
    target: 5000000,
    terkumpul: 3000000,
    tanggalTarget: "2025-09-10",
  },
];

export default function RingkasanGoalSection({
  goals = dummyGoals,
  onHapus,
  onTambahUang,
}: Props) {
  const isKosong = goals.length === 0;

  return (
    <section className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-700 dark:text-white flex items-center gap-2">
        <FaBullseye className="text-indigo-600" />
        Ringkasan Goal Keuangan
      </h2>

      {isKosong ? (
        <div className="p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
          <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaRegClipboard className="text-3xl text-indigo-500" />
            <p className="text-sm">Belum ada goal yang ditambahkan.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tambahkan goal untuk mulai menabung dengan tujuan!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const persentase = Math.min(
              100,
              Math.round((goal.terkumpul / goal.target) * 100)
            );
            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {goal.nama}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {persentase}%
                    </span>
                  </div>

                  <Progress value={persentase} className="h-2" />

                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-2 flex justify-between">
                    <span>Rp {goal.terkumpul.toLocaleString()}</span>
                    <span>Target: Rp {goal.target.toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    Deadline: {goal.tanggalTarget}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
