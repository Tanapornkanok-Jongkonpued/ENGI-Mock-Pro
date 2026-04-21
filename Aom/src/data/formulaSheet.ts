import type { BranchId, FormulaSection } from "../types";

const formulaData: Record<BranchId, FormulaSection[]> = {
  civil: [
    {
      id: "structural",
      title: "Structural Analysis",
      formulas: [
        {
          id: "beam_deflect",
          nameEN: "Beam Deflection (UDL)",
          nameTH: "การโก่งตัวของคาน (UDL)",
          formula: "δ_max = 5wL⁴ / 384EI",
          variables:
            "w=load/unit length, L=span, E=elastic modulus, I=moment of inertia",
          unit: "m",
        },
        {
          id: "moment_inertia",
          nameEN: "Moment of Inertia (Rectangle)",
          nameTH: "โมเมนต์ความเฉื่อย (สี่เหลี่ยม)",
          formula: "I = bh³ / 12",
          variables: "b=width, h=height",
          unit: "m⁴",
        },
        {
          id: "bending_stress",
          nameEN: "Bending Stress",
          nameTH: "ความเค้นดัด",
          formula: "σ = Mc / I",
          variables:
            "M=bending moment, c=distance to neutral axis, I=moment of inertia",
          unit: "Pa",
        },
      ],
    },
    {
      id: "geotechnical",
      title: "Geotechnical Engineering",
      formulas: [
        {
          id: "bearing_capacity",
          nameEN: "Ultimate Bearing Capacity (Terzaghi)",
          nameTH: "กำลังรับน้ำหนักที่ฐานราก",
          formula: "q_u = cNc + γDNq + 0.5γBNγ",
          variables:
            "c=cohesion, γ=unit weight, D=depth, B=width, Nc,Nq,Nγ=bearing capacity factors",
          unit: "kPa",
        },
        {
          id: "darcys",
          nameEN: "Darcy's Law",
          nameTH: "กฎของดาร์ซี",
          formula: "Q = kiA",
          variables:
            "k=hydraulic conductivity, i=hydraulic gradient, A=cross-sectional area",
          unit: "m³/s",
        },
      ],
    },
    {
      id: "hydraulics",
      title: "Hydraulics",
      formulas: [
        {
          id: "mannings",
          nameEN: "Manning's Equation",
          nameTH: "สมการแมนนิ่ง",
          formula: "V = (1/n)R^(2/3)S^(1/2)",
          variables: "n=Manning roughness, R=hydraulic radius, S=slope",
          unit: "m/s",
        },
        {
          id: "bernoulli",
          nameEN: "Bernoulli's Equation",
          nameTH: "สมการเบอร์นูลลี",
          formula: "P/γ + V²/2g + z = constant",
          variables:
            "P=pressure, γ=specific weight, V=velocity, g=gravity, z=elevation",
          unit: "m (head)",
        },
      ],
    },
  ],
  electrical: [
    {
      id: "circuit",
      title: "Circuit Theory",
      formulas: [
        {
          id: "ohms_law",
          nameEN: "Ohm's Law",
          nameTH: "กฎของโอห์ม",
          formula: "V = IR",
          variables: "V=voltage(V), I=current(A), R=resistance(Ω)",
          unit: "V",
        },
        {
          id: "power",
          nameEN: "Electric Power",
          nameTH: "กำลังไฟฟ้า",
          formula: "P = VI = I²R = V²/R",
          variables: "P=power(W), V=voltage, I=current, R=resistance",
          unit: "W",
        },
        {
          id: "apparent_power",
          nameEN: "Apparent / Reactive Power",
          nameTH: "กำลังไฟฟ้าปรากฏ/รีแอคทีฟ",
          formula: "S = P + jQ = VI* (VA)\nQ = VIsinφ (VAR)",
          variables: "S=apparent, P=real, Q=reactive, φ=power factor angle",
          unit: "VA",
        },
      ],
    },
    {
      id: "transformer",
      title: "Transformer",
      formulas: [
        {
          id: "turns_ratio",
          nameEN: "Turns Ratio",
          nameTH: "อัตราส่วนรอบขด",
          formula: "V1/V2 = N1/N2 = I2/I1",
          variables: "V=voltage, N=turns, I=current",
          unit: "-",
        },
      ],
    },
  ],
  mechanical: [
    {
      id: "thermo",
      title: "Thermodynamics",
      formulas: [
        {
          id: "carnot",
          nameEN: "Carnot Efficiency",
          nameTH: "ประสิทธิภาพคาร์โนต์",
          formula: "η_Carnot = 1 - T_L/T_H",
          variables: "T_L=cold reservoir temp (K), T_H=hot reservoir temp (K)",
          unit: "%",
        },
        {
          id: "first_law",
          nameEN: "First Law of Thermodynamics",
          nameTH: "กฎข้อที่ 1",
          formula: "ΔU = Q - W",
          variables:
            "ΔU=change in internal energy, Q=heat added, W=work done by system",
          unit: "J",
        },
        {
          id: "ideal_gas",
          nameEN: "Ideal Gas Law",
          nameTH: "กฎแก๊สอุดมคติ",
          formula: "PV = nRT",
          variables:
            "P=pressure(Pa), V=volume(m³), n=moles, R=8.314 J/(mol·K), T=temperature(K)",
          unit: "Pa·m³",
        },
      ],
    },
    {
      id: "mechanics",
      title: "Mechanics of Materials",
      formulas: [
        {
          id: "stress_strain",
          nameEN: "Stress-Strain (Elastic)",
          nameTH: "ความเค้น-ความเครียด",
          formula: "σ = Eε",
          variables:
            "σ=normal stress(Pa), E=Young modulus(Pa), ε=strain(dimensionless)",
          unit: "Pa",
        },
        {
          id: "shear_stress",
          nameEN: "Shear Stress in Shaft",
          nameTH: "ความเค้นเฉือนในเพลา",
          formula: "τ = Tc/J",
          variables: "T=torque, c=outer radius, J=polar moment of inertia",
          unit: "Pa",
        },
      ],
    },
  ],
  industrial: [
    {
      id: "inventory",
      title: "Inventory Management",
      formulas: [
        {
          id: "eoq",
          nameEN: "Economic Order Quantity",
          nameTH: "ปริมาณสั่งซื้อที่ประหยัดที่สุด",
          formula: "EOQ = √(2DS/H)",
          variables:
            "D=annual demand, S=ordering cost, H=holding cost per unit per year",
          unit: "units",
        },
      ],
    },
    {
      id: "quality",
      title: "Quality Engineering",
      formulas: [
        {
          id: "oee",
          nameEN: "Overall Equipment Effectiveness",
          nameTH: "ประสิทธิผลโดยรวมของเครื่องจักร",
          formula: "OEE = Availability × Performance × Quality",
          variables: "Each factor is a decimal ratio",
          unit: "%",
        },
        {
          id: "cpk",
          nameEN: "Process Capability Index (Cpk)",
          nameTH: "ดัชนีความสามารถกระบวนการ",
          formula: "Cpk = min[(USL-μ)/3σ, (μ-LSL)/3σ]",
          variables:
            "USL=upper spec limit, LSL=lower spec limit, μ=mean, σ=std dev",
          unit: "-",
        },
      ],
    },
    {
      id: "pm_tools",
      title: "Project Management",
      formulas: [
        {
          id: "pert",
          nameEN: "PERT Expected Time",
          nameTH: "เวลาคาดหวัง PERT",
          formula: "te = (a + 4m + b) / 6",
          variables: "a=optimistic, m=most likely, b=pessimistic",
          unit: "days",
        },
      ],
    },
  ],
  chemical: [
    {
      id: "reaction",
      title: "Chemical Reaction Engineering",
      formulas: [
        {
          id: "cstr",
          nameEN: "CSTR Design Equation",
          nameTH: "สมการออกแบบ CSTR",
          formula: "V = F_A0 · X / (-r_A)",
          variables:
            "V=volume, F_A0=molar feed rate, X=conversion, -r_A=reaction rate",
          unit: "m³",
        },
        {
          id: "pfr",
          nameEN: "PFR Design Equation",
          nameTH: "สมการออกแบบ PFR",
          formula: "V = F_A0 ∫₀ˣ dX/(-r_A)",
          variables: "V=volume, F_A0=molar feed rate, X=conversion",
          unit: "m³",
        },
      ],
    },
    {
      id: "thermochem",
      title: "Thermochemistry",
      formulas: [
        {
          id: "heat_rxn",
          nameEN: "Heat of Reaction",
          nameTH: "ความร้อนของปฏิกิริยา",
          formula: "ΔH_rxn = Σ ΔHf(products) - Σ ΔHf(reactants)",
          variables: "ΔHf=standard enthalpy of formation",
          unit: "kJ/mol",
        },
      ],
    },
  ],
  environmental: [
    {
      id: "water",
      title: "Water Treatment",
      formulas: [
        {
          id: "bod",
          nameEN: "BOD Remaining",
          nameTH: "BOD คงเหลือ",
          formula: "BOD_t = BOD_u(1 - e^(-k·t))",
          variables: "BOD_u=ultimate BOD, k=BOD rate constant, t=time",
          unit: "mg/L",
        },
        {
          id: "ct_value",
          nameEN: "CT Value (Disinfection)",
          nameTH: "ค่า CT",
          formula: "CT = C × T",
          variables:
            "C=disinfectant concentration (mg/L), T=contact time (min)",
          unit: "mg·min/L",
        },
      ],
    },
    {
      id: "air",
      title: "Air Pollution",
      formulas: [
        {
          id: "noise_atten",
          nameEN: "Sound Attenuation (Point Source)",
          nameTH: "การลดทอนเสียง",
          formula: "L2 = L1 - 20·log(r2/r1)",
          variables: "L1=level at r1, L2=level at r2, r=distance",
          unit: "dBA",
        },
      ],
    },
  ],
};

export function getFormulasByBranch(branch: BranchId): FormulaSection[] {
  return formulaData[branch] ?? [];
}

export { formulaData };
