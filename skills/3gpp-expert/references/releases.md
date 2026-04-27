# 3GPP Releases Reference

## Table of Contents
1. [GSM Era (Phase 1 – Release 98)](#gsm-era)
2. [3G/UMTS Era (Release 99 – Release 7)](#3g-umts-era)
3. [4G/LTE Era (Release 8 – Release 14)](#4g-lte-era)
4. [5G Era (Release 15 – Release 17)](#5g-era)
5. [5G-Advanced (Release 18 – Release 19)](#5g-advanced)
6. [6G Horizon (Release 20 – Release 21)](#6g-horizon)
7. [Specification Series Quick Reference](#spec-series)

---

## GSM Era (Phase 1 – Release 98) {#gsm-era}

### Phase 1 (1992)
- Basic GSM system: circuit-switched voice, SMS
- TDMA-based air interface (200 kHz channels, 8 timeslots)
- Full-rate speech codec (13 kbps)

### Phase 2 (1995)
- Enhanced Full Rate (EFR) codec
- Half-rate codec
- Emergency call enhancements
- Supplementary services improvements

### Release 96 (Q1 1997)
- 14.4 kbps data rate over circuit-switched bearers
- Enhanced SMS capabilities
- Advice of Charge enhancements

### Release 97 (Q1 1998)
- **GPRS (General Packet Radio Service)**: First packet data service on GSM — theoretical peak ~171.2 kbps
- New packet-switched core network elements: SGSN, GGSN
- GPRS Tunneling Protocol (GTP)

### Release 98 (Q1 1999)
- **EDGE (Enhanced Data rates for GSM Evolution)**: 8-PSK modulation → up to ~384 kbps
- GPRS for PCS 1900 band
- AMR (Adaptive Multi-Rate) speech codec
- CAMEL Phase 2 for intelligent networking

---

## 3G/UMTS Era (Release 99 – Release 7) {#3g-umts-era}

### Release 99 / Release 3 (Q1 2000)
- **UMTS with WCDMA**: First 3G standard — 5 MHz bandwidth, 384 kbps (practical), up to 2 Mbps theoretical
- New RAN architecture: Node B + RNC (Radio Network Controller)
- Core network: MSC/VLR (CS domain), SGSN/GGSN (PS domain)
- Soft handover, power control, RAKE receiver
- Iu, Iub, Iur interfaces

### Release 4 (Q2 2001)
- **All-IP Core Network** (CS domain over IP transport — bearer-independent CS core)
- TD-SCDMA added as TDD mode (China's contribution)
- Low-chip-rate TDD (1.28 Mcps)
- MMS (Multimedia Messaging Service)

### Release 5 (Q1 2002)
- **HSDPA (High Speed Downlink Packet Access)**: Shared channel (HS-DSCH), HARQ, AMC, up to 14.4 Mbps theoretical
- **IMS (IP Multimedia Subsystem)**: SIP-based session control for VoIP and multimedia services
- New transport channel: HS-DSCH with 2ms TTI
- 16-QAM modulation for downlink

### Release 6 (Q4 2004)
- **HSUPA (High Speed Uplink Packet Access)**: E-DCH with 10ms/2ms TTI, HARQ, up to 5.76 Mbps
- HSPA = HSDPA + HSUPA combined
- **MBMS (Multimedia Broadcast/Multicast Service)**
- WLAN-3GPP interworking (I-WLAN)
- IMS enhancements: Push-to-Talk over Cellular (PoC)

### Release 7 (Q4 2007)
- **HSPA+**: 64-QAM DL (21.1 Mbps), 16-QAM UL (11.5 Mbps)
- MIMO for HSDPA (2×2 MIMO → 28.8 Mbps)
- Continuous Packet Connectivity (CPC) — reduced overhead for always-on
- **VoIP over HSPA** enhancements
- NFC integration
- EDGE Evolution

---

## 4G/LTE Era (Release 8 – Release 14) {#4g-lte-era}

### Release 8 (Q4 2008) — "LTE Introduction"
- **LTE air interface**: OFDMA (DL), SC-FDMA (UL), up to 300 Mbps DL / 75 Mbps UL
- Bandwidth: 1.4 to 20 MHz, FDD and TDD modes
- Flat architecture: eNB directly to EPC (no RNC)
- **EPC (Evolved Packet Core)**: All-IP, MME, S-GW, P-GW, HSS, PCRF
- MIMO: Up to 4×4 DL, 1 UE Tx antenna
- Turbo coding, HARQ, AMC
- GTP-based S1 and X2 interfaces
- **SAE (System Architecture Evolution)**: TS 23.401, TS 23.402

### Release 9 (Q4 2009)
- Enhanced MBMS (eMBMS)
- Dual-cell HSDPA (DC-HSDPA) — aggregate 2 carriers on 3G
- IMS emergency calls over LTE
- Self-Organizing Networks (SON) Phase 1
- Home eNodeB (HeNB / femtocell) enhancements
- Location services improvements

### Release 10 (Q1 2011) — "LTE-Advanced" (meets IMT-Advanced)
- **Carrier Aggregation (CA)**: Up to 5 CCs × 20 MHz = 100 MHz, 3 Gbps theoretical DL
- **Enhanced MIMO**: 8×8 DL, 4×4 UL
- **Relay Nodes**: Type 1 (in-band/out-band backhaul)
- Enhanced ICIC (eICIC) for HetNets — ABS (Almost Blank Subframes)
- Uplink CoMP study
- VoLTE readiness

### Release 11 (Q3 2012)
- **CoMP (Coordinated Multi-Point)**: Joint transmission, coordinated scheduling/beamforming
- Enhanced eICIC (FeICIC) for HetNets
- Carrier Aggregation enhancements (inter-band TDD)
- MIMO: Advanced codebook, 4Tx DL
- SON Phase 2 enhancements
- Machine-type communications (MTC) studies

### Release 12 (March 2015)
- **D2D (Device-to-Device) / ProSe**: Direct UE communication, public safety use cases
- **Dual Connectivity (DC)**: UE connected to MeNB + SeNB simultaneously
- 256-QAM for DL
- Small cell enhancements (SCE): dual connectivity, discovery
- MTC enhancements: low-cost MTC UE category, power saving mode (PSM)
- SON enhancements Phase 3
- Network-assisted interference cancellation

### Release 13 (Q1 2016) — "LTE-Advanced Pro"
- **NB-IoT (Narrowband IoT)**: 180 kHz bandwidth, deep coverage for IoT
- **LTE-M (Cat-M1 / eMTC)**: 1.4 MHz bandwidth for IoT, VoLTE support
- **LAA (Licensed Assisted Access)**: LTE in 5 GHz unlicensed spectrum (DL only)
- **LWA (LTE-WLAN Aggregation)**
- Up to 32 component carriers CA (theoretical)
- Full-dimension MIMO (FD-MIMO): Up to 16 ports
- Latency reduction study (shortened TTI)
- Dual connectivity enhancements
- Single-cell point-to-multipoint (SC-PTM)

### Release 14 (Mid 2017) — "Road to 5G"
- **C-V2X (Cellular Vehicle-to-Everything)**: PC5 interface, Mode 3/4
- **eLAA (Enhanced LAA)**: UL in unlicensed spectrum
- **Further NB-IoT and eMTC enhancements**: Multicast, positioning, mobility
- 1024-QAM study (DL)
- LTE-based 5G study items began
- Shortened TTI (sTTI) and faster processing
- Aerial vehicles (drones) studies
- LWIP (LTE/WLAN Integration with IPsec)

---

## 5G Era (Release 15 – Release 17) {#5g-era}

### Release 15 (Late 2018) — "5G Phase 1"

**Three drops:**
1. Early drop (Dec 2017): NSA NR (Option 3 — LTE anchor + NR)
2. Main drop (June 2018): SA NR (Option 2 — standalone NR + 5GC)
3. Late drop (March 2019): Migration architectures (Options 4, 5, 7)

**NR (New Radio) — TS 38 series:**
- Flexible numerology: Subcarrier spacing 15/30/60/120/240 kHz
- Frequency ranges: FR1 (410 MHz – 7.125 GHz), FR2 (24.25 – 52.6 GHz)
- Channel coding: LDPC (data), Polar (control)
- Massive MIMO & beamforming (beam management: P1/P2/P3 procedures)
- Bandwidth parts (BWP) for flexible resource allocation
- Mini-slots (2/4/7 symbols) for low latency
- Slot-based and non-slot-based scheduling
- CORESET and search spaces for PDCCH
- SSB (SS/PBCH Block) with beam sweeping
- New SDAP layer for QoS flow mapping
- RRC INACTIVE state (three states: IDLE/INACTIVE/CONNECTED)
- Supplementary uplink (SUL)
- CSI framework overhaul (Type I / Type II codebooks)

**5G Core (5GC) — TS 23.5xx series:**
- Service-Based Architecture (SBA): HTTP/2, JSON, RESTful APIs
- Network Functions: AMF, SMF, UPF, PCF, UDM, AUSF, NRF, NSSF, NEF, AF
- Network Slicing (S-NSSAI = SST + SD)
- Control/User Plane Separation (CUPS)
- Session and Service Continuity (SSC) modes 1/2/3
- Unified Data Management (UDM replacing HSS)
- Network Repository Function (NRF) for NF discovery/registration

**Deployment options:**
- Option 3/3a/3x: NSA — LTE eNB as master, NR as secondary (EN-DC)
- Option 2: SA — NR gNB + 5GC
- Option 7/7a/7x: ng-eNB (upgraded LTE) as master, NR secondary, both connected to 5GC (NGEN-DC)
- Option 4/4a: NR as master, LTE as secondary, 5GC (NE-DC)
- Option 5: ng-eNB (LTE) connected to 5GC only

### Release 16 (July 2020) — "5G Phase 2"
- **NR V2X (Sidelink)**: PC5 for advanced V2X use cases, Mode 1 (gNB-scheduled) and Mode 2 (UE-autonomous)
- **IIoT / URLLC enhancements**: TSN (Time-Sensitive Networking) integration, configured grants Type 1/2, intra-UE prioritization, PDCP duplication enhancements
- **Integrated Access & Backhaul (IAB)**: NR-based wireless backhaul for small cells
- **NR Positioning**: DL-TDOA, UL-TDOA, DL-AoD, UL-AoA, multi-RTT — using PRS/SRS
- **NR-U (NR in Unlicensed spectrum)**: LBT (Listen Before Talk), 5/6 GHz bands
- **Dynamic Spectrum Sharing (DSS)**: Shared LTE/NR operation on same carrier
- **MIMO enhancements**: Multi-TRP (Transmission-Reception Point), enhanced Type II codebook
- **Power saving**: UE assistance information, cross-slot scheduling, PDCCH skipping
- **2-step RACH**: MsgA + MsgB (combined Msg1+3 / Msg2+4)
- **Dual connectivity & CA enhancements**
- **SON/MDT for NR**
- Ethernet header support in 5GS for industrial
- Non-public networks (NPN) — SNPN and PNI-NPN

### Release 17 (March 2022)
- **NTN (Non-Terrestrial Networks)**: LEO and GEO satellite integration into NR (TS 38.821), timing advance and Doppler compensation, store-and-forward for IoT-NTN
- **RedCap (Reduced Capability NR)**: 20 MHz bandwidth (FR1), 100 MHz (FR2), 1 or 2 Rx antennas, relaxed processing, for IoT/wearables/industrial sensors
- **NR sidelink enhancements**: Relay, power saving, resource allocation improvements
- **MIMO**: Up to Rel-17 multi-TRP, SRS enhancements, Unified TCI framework (Stage 1)
- **Multicast/Broadcast (NR MBS)**: Point-to-multipoint in NR, multicast/broadcast sessions
- **Positioning enhancements**: cm-level accuracy for IIoT, DL PRS enhancements
- **Small data transmission (SDT)**: Data transfer in RRC INACTIVE via RACH or configured grant
- **QoE (Quality of Experience)** measurement collection
- **Dynamic spectrum sharing enhancements**
- **NR coverage enhancements**: PUSCH/PUCCH repetition, msg3 and msgA coverage
- **UE power saving**: Paging early indication, relaxed measurement for stationary UE
- **Extended reality (XR)** study — laying groundwork for Rel-18
- **AI/ML for NR** study (TR 38.843) — setting stage for Rel-18 work items
- **Network Automation (eNA)**: NWDAF enhancements Phase 2
- **Edge Computing**: Enhanced support for edge application servers
- 52.6–71 GHz study (FR2 extension — "FR2-2")

---

## 5G-Advanced (Release 18 – Release 19) {#5g-advanced}

### Release 18 (Frozen ~Dec 2024) — "5G-Advanced Phase 1"

This release marks the start of 5G-Advanced. Key work items:

**AI/ML for NR Air Interface:**
- AI/ML-based CSI feedback (compression, prediction)
- AI/ML-based beam management (prediction)
- AI/ML-based positioning (enhancement)
- Lifecycle management: training, inference, monitoring, fallback
- TS 38.843 (study → normative in Rel-18)

**MIMO Evolution:**
- 8 Tx UE codebook
- Unified TCI framework (completed)
- Coherent Joint Transmission (CJT) for multi-TRP
- CSI enhancements (Type II, CRI-based reporting)
- SRS enhancements for 8 Tx UE

**Duplex Evolution:**
- Subband non-overlapping full duplex (SBFD) study
- Cross-division duplex (XDD) study

**Energy Efficiency / Network Energy Savings:**
- gNB energy saving techniques: cell DTX, adaptation of spatial elements/SCS/bandwidth, SSB-less operation
- UE power saving: further relaxed measurements, PDCCH monitoring reduction

**XR (Extended Reality):**
- Capacity enhancements for XR traffic patterns (periodic + jitter)
- Power saving for XR UEs
- Awareness-based scheduling

**NTN Enhancements:**
- NR-NTN: Store-and-forward, coverage enhancements for handheld UEs
- IoT-NTN: eMTC/NB-IoT over satellite enhancements
- Discontinuous coverage handling

**RedCap Evolution (eRedCap):**
- Further bandwidth reduction (5 MHz FR1)
- Reduced peak rate requirements
- Targeting simpler sensors and ambient IoT adjacency

**Sidelink Enhancements:**
- Sidelink relay (UE-to-network relay, UE-to-UE relay)
- Power saving for sidelink
- Sidelink carrier aggregation
- Sidelink positioning

**Ambient IoT:**
- Study on ultra-low-power/zero-energy devices
- Backscatter and energy harvesting concepts
- Inventory, command, and positioning use cases

**Positioning:**
- Low-power high-accuracy positioning
- Sidelink-based positioning
- Carrier phase positioning for cm-level accuracy

**Multicast/Broadcast:**
- MBS enhancements (RRC INACTIVE reception, inter-cell coordination)

**Mobility:**
- L1/L2-based inter-cell mobility (DAPS-like at lower layers)
- Conditional handover (CHO) enhancements
- LTM (Lower Layer Triggered Mobility)

### Release 19 (Target freeze ~Late 2025/early 2026) — "5G-Advanced Phase 2"

Building on Rel-18, extending 5G-Advanced further:

**AI/ML Phase 2:**
- AI/ML for mobility optimization
- AI/ML for SON
- Enhanced lifecycle management (model transfer, federated learning considerations)

**Further MIMO:**
- More than 8 Tx UE
- Advanced multi-TRP techniques
- Distributed MIMO concepts

**Network Sensing:**
- Sensing use cases (object detection, tracking, environment monitoring)
- Integration with communication functions

**XR Evolution:**
- Higher capacity, lower latency for immersive services
- Multi-modal XR support

**NTN Phase 3:**
- Direct satellite-to-device improvements
- Multi-connectivity (terrestrial + NTN)
- Inter-satellite links study

**Core Network:**
- NWDAF enhancements (AI/ML model sharing, federated analytics)
- NEF/CAPIF evolution
- Network slicing enhancements
- Enterprise-grade reliability (private + public network integration)

---

## 6G Horizon (Release 20 – Release 21) {#6g-horizon}

### Release 20 (Expected ~2027) — "6G Studies"
- First 6G study items on requirements, architecture, security, radio evolution
- Continuation of ambitious 5G-Advanced features
- Study areas expected:
  - Sub-THz spectrum exploration (100 GHz – 300 GHz)
  - AI-native network design
  - Integrated Sensing and Communication (ISAC)
  - Extreme positioning
  - Sustainable/energy-efficient RAN and core
  - Digital twin networks
- TR 22.870: 6G Use Cases and Service Requirements (Stage 1) — complete
- TR 38.914: 6G Scenarios and Requirements (RAN study) — in progress

### Release 21 (Expected ~2028-2029) — "First 6G Normative"
- First normative 6G specifications
- Target commercial 6G: ~2030
- Expected to cover:
  - New air interface candidates
  - Next-generation core architecture
  - AI as a native network feature
  - Holographic communication, digital twins
  - Tbps-class peak data rates
  - Sub-ms latency targets
  - Massive connectivity (10^7 devices/km²)

---

## Specification Series Quick Reference {#spec-series}

| Series | Scope | Examples |
|--------|-------|---------|
| 21 | Requirements | TS 21.905 (Vocabulary) |
| 22 | Service aspects (Stage 1) | TS 22.261 (5G service requirements) |
| 23 | Architecture (Stage 2) | TS 23.501 (5GS architecture), TS 23.401 (EPS) |
| 24 | UE-CN signaling (Stage 3) | TS 24.501 (5G NAS), TS 24.301 (EPS NAS) |
| 25 | UTRAN (3G radio) | TS 25.331 (UTRAN RRC) |
| 26 | Codecs | TS 26.171 (AMR-WB speech codec) |
| 27 | Data terminal equipment | |
| 28 | Signaling protocols (SS7) | |
| 29 | Core network protocols | TS 29.244 (PFCP for UPF), TS 29.274 (GTPv2-C) |
| 30 | Program management | |
| 31 | UICC / USIM | |
| 32 | OAM (Charging, management) | TS 32.255 (5G charging) |
| 33 | Security | TS 33.501 (5G security architecture) |
| 34 | Test specifications (UE) | |
| 35 | Security algorithms | TS 35.231 (TUAK algorithm) |
| 36 | LTE / E-UTRAN | TS 36.331 (LTE RRC), TS 36.211 (LTE PHY channels) |
| 37 | Multi-RAT aspects | TS 37.340 (Multi-connectivity, EN-DC/NR-DC) |
| 38 | NR / NG-RAN | TS 38.331 (NR RRC), TS 38.211 (NR PHY), TS 38.300 (NR overall description) |

### Key "Go-To" Specifications

**5G System Architecture:**
- TS 23.501: System Architecture for the 5G System (Stage 2)
- TS 23.502: Procedures for the 5G System (Stage 2)
- TS 23.503: Policy and Charging Control (Stage 2)

**NR Radio:**
- TS 38.300: NR and NG-RAN Overall Description (Stage 2)
- TS 38.211: Physical Channels and Modulation
- TS 38.212: Multiplexing and Channel Coding
- TS 38.213: Physical Layer Procedures for Control
- TS 38.214: Physical Layer Procedures for Data
- TS 38.321: MAC Protocol
- TS 38.322: RLC Protocol
- TS 38.323: PDCP Protocol
- TS 38.324: SDAP Protocol
- TS 38.331: RRC Protocol

**NAS and Signaling:**
- TS 24.501: NAS Protocol for 5G (UE-AMF)
- TS 24.502: Access to 5GCN via non-3GPP access

**Security:**
- TS 33.501: Security Architecture and Procedures for 5G

**Network Slicing:**
- TS 28.530: Management of Network Slicing
- TS 23.501 §5.15: Network Slicing
