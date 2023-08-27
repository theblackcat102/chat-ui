<script lang="ts">
	import { afterUpdate, onMount } from "svelte";
	import CopyToClipBoardBtn from "./CopyToClipBoardBtn.svelte";

	export let code = "";
	export let lang = "";

	$: highlightedCode = "";
    console.log('found latext');
	afterUpdate(async () => {
		const { default: hljs } = await import("highlight.js");
		const language = hljs.getLanguage(lang);

		highlightedCode = hljs.highlightAuto(code, language?.aliases).value;
	});
	onMount(() => {
		let script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
        document.head.append(script);  
        script.onload = () => {
            MathJax = {
                tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
                svg: {fontCache: 'global'}
            };
		};					  
	});
    // let pre = "\\begin{align*} \frac{dC_a}{dt} &= (G_a - BMa)C_a - \left(\frac{VS_a}{\delta z} + PR_a\right)C_a + \frac{Q(C_{ai} - C_{ae})}{V}\\ \\ \frac{dC_b}{dt} &= G_bC_b - \left(\frac{VS_b}{\delta z} + PR_b + k_d\right)C_b + \frac{Q(C_{bi} - C_{be})}{V}\\ \\ \frac{dO_2}{dt} &= \alpha(P_{ht} - BMa)C_a - NITO_2 - R_{bae} + S_r + \frac{Q(O_{2i} - O_{2e})}{V}\\ \\ \frac{dCOD}{dt} &= -f_{bm} - C_{Ob} - R_{anae} + \alpha_2 f_{bm}BM_{cod}\frac{Q(COD_i - COD_e)}{V}\\ \\ \frac{dN_{H4}}{dt} &= -P_n(G_aC_aanc + G_bC_bb_{nc}) + R_{nit} + K_{min}ON + B_{NH4} + \frac{Q(N_{H4i} - N_{H4e})}{V}\\ \\ \frac{dN_{O3}}{dt} &= -(1 - P_n)(G_aC_aanc + G_bC_bb_{nc}) + R_{nit} - \lambda C_{Obno} + \frac{Q(N_{O3i} - N_{O3e})}{V}\\ \\ \frac{dON}{dt} &= B_{ON} - K_{min}ON + \frac{Q(ON_i - ON_e)}{V}\\ \\ \frac{dP_{O4}}{dt} &= -G_aC_aap_c + G_bC_bbp_c + B_{PO4} + K_{min}OP + \frac{Q(P_{O4i} - P_{O4e})}{V}\\ \\ \frac{dOP}{dt} &= B_{OP} - K_{min}OP + \frac{Q(OP_i - OP_e)}{V}\\ \\ \frac{dN_{bent}}{dt} &= (1 - F_{nb})(\frac{VS_aC_aanc}{\delta z} + \frac{VS_bC_bb_{nc}}{\delta z}) - R_{dc1}N_{bent}\\ \\ \frac{dON_{bent}}{dt} &= F_{org}R_{dc2}N_{bent} - K_{min}ON_{bent}\\ \\ \frac{dN_{H4bent}}{dt} &= (1 - F_{org})R_{dc2}N_{bent} + K_{min}ON_{bent}\\ \\ \frac{dP_{bent}}{dt} &= (1 - F_{nb})(\frac{VS_aC_aap_c}{\delta z} + \frac{VS_bC_bbp_c}{\delta z}) - R_{dcp}P_{bent}\\ \\ \frac{dP_{O4bent}}{dt} &= (1 - F_{org})R_{dcp}P_{bent} + K_{min}OP_{bent}\\ \\ \frac{dOP_{bent}}{dt} &= F_{org}R_{dcp}P_{bent} - K_{min}OP_{bent} \end{align*} "
</script>

<div class="group relative my-4 rounded-lg">
	<!-- eslint-disable svelte/no-at-html-tags -->
    <p class="overflow-auto px-5 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
        {code}
    </p>
</div>
