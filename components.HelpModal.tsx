import React from 'react';
import { X, Play, Settings, Library, Eye, Activity, Smartphone, MousePointer2 } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-full p-1 z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2 border-b border-gray-800 pb-6">
                        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter">
                            Cellmonic クイックガイド
                        </h2>
                        <p className="text-gray-400 text-sm">
                            生命シミュレーションで音楽を奏でるシーケンサー
                        </p>
                    </div>

                    <div className="space-y-10">
                        
                        {/* Step 1: MIDI Setup */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-cyan-400 text-xs font-bold">1</span>
                                <Settings size={18} className="text-cyan-400" />
                                準備：音の出口を用意する
                            </h3>
                            <div className="pl-9 space-y-3">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    ブラウザ内蔵の簡易音源でも音は出ますが、このアプリの真価を発揮するには<strong>外部MIDI音源</strong>や<strong>DAW</strong>との連携がおすすめです。
                                </p>
                                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-400">
                                    <div className="flex gap-2 mb-2">
                                        <Settings size={16} className="shrink-0 mt-0.5" />
                                        <span>
                                            サイドバーの <strong>Grid</strong> タブ（歯車アイコン）を開き、<strong>MIDI Output</strong> から接続先を選んでください。
                                        </span>
                                    </div>
                                    <ul className="list-disc list-inside pl-6 text-xs text-gray-500 space-y-1">
                                        <li>Mac: <span className="text-gray-300">IACドライバ</span> を有効にするとDAWに送信できます。</li>
                                        <li>Windows: <span className="text-gray-300">LoopBe1</span> などの仮想MIDIポートソフトが便利です。</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Step 2: Play */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-green-400 text-xs font-bold">2</span>
                                <Activity size={18} className="text-green-400" />
                                再生：生命を動かす
                            </h3>
                            <div className="pl-9">
                                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                    準備ができたら、サイドバーの <strong>Sim</strong> タブ（波形アイコン）にある <Play size={14} className="inline text-green-400" /> <strong>再生ボタン</strong>を押してみましょう。
                                </p>
                                <p className="text-gray-300 text-sm">
                                    グリッド上の点が生き物のように動き出し、点灯した場所に対応する音が鳴り響きます。
                                </p>
                            </div>
                        </section>

                        {/* Step 3: Presets */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-purple-400 text-xs font-bold">3</span>
                                <Library size={18} className="text-purple-400" />
                                探索：パターンを切り替える
                            </h3>
                            <div className="pl-9">
                                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                    どんな設定が良いかわからないときは、<strong>Lib</strong> タブ（本棚アイコン）を開いてみてください。
                                </p>
                                <p className="text-gray-300 text-sm">
                                    <strong>"Drum Pad"</strong> や <strong>"Chaos"</strong> などのプリセットを選ぶだけで、リズムや音の密度がガラリと変わります。お気に入りの設定ができたら、ここに保存することもできます。
                                </p>
                            </div>
                        </section>

                        {/* Step 4: Customize */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-yellow-400 text-xs font-bold">4</span>
                                <MousePointer2 size={18} className="text-yellow-400" />
                                創造：自分だけの音楽へ
                            </h3>
                            <div className="pl-9 space-y-4">
                                <p className="text-gray-300 text-sm">
                                    慣れてきたら、パラメータをいじって独自のシーケンスを作ってみましょう。
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-gray-800/30 p-3 rounded border border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-1 text-cyan-300 text-xs font-bold">
                                            <Settings size={12} /> Grid Size / Center Note
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Gridタブで<strong>広さ</strong>や<strong>音域</strong>を変更できます。サイズを変えるとリズムの周期が変わり、Center Noteを変えると全体のピッチが変わります。
                                        </p>
                                    </div>
                                    <div className="bg-gray-800/30 p-3 rounded border border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-1 text-green-300 text-xs font-bold">
                                            <Smartphone size={12} /> Ants / CA Rule
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Simタブで<strong>Ants（動くエージェント）</strong>の数を増やすと、メロディラインが増えます。Ruleを変えると、音の発生頻度が変化します。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Step 5: Visuals */}
                        <section className="space-y-3 pt-2 border-t border-gray-800">
                            <h3 className="text-lg font-bold text-gray-400 flex items-center gap-2 text-sm">
                                <Eye size={16} />
                                補足：見た目を楽しむ
                            </h3>
                            <div className="pl-9">
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    <strong>Look</strong> タブ（目アイコン）では、色のテーマや描画モード（ネオン風、ターミナル風など）を変更できます。<br/>
                                    キーボードの <span className="bg-gray-700 px-1 rounded text-gray-300">H</span> を押すとUIが消え、映像と音楽に没頭できます。
                                </p>
                            </div>
                        </section>

                    </div>

                    <div className="pt-4 text-center">
                        <button 
                            onClick={onClose}
                            className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 border border-cyan-700/50 px-10 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};