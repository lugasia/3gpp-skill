# 3GPP Working Group Structure

## 3GPP Organizational Structure

3GPP is organized into three **Technical Specification Groups (TSGs)**:
- **RAN** — Radio Access Network
- **SA** — Service & System Aspects
- **CT** — Core Network & Terminals

Each TSG has a **plenary** (approves work items, specs, releases) and multiple **Working Groups (WGs)**.

---

## RAN Working Groups

### RAN WG1 — Physical Layer Specifications
- **Scope**: PHY layer algorithms and procedures — modulation, coding, waveforms, MIMO, beamforming, numerology, HARQ, link adaptation
- **Key specs owned**: TS 36.211/212/213/214 (LTE PHY), TS 38.211/212/213/214 (NR PHY)
- **Typical topics**: new coding schemes (LDPC, Polar), massive MIMO precoding, NR numerology design, URLLC PHY enhancements, AI/ML for air interface (Rel-18+)

### RAN WG2 — Radio Layer Protocols
- **Scope**: Layer 2 and Layer 3 radio protocols — MAC, RLC, PDCP, SDAP, RRC
- **Key specs owned**: TS 36.321/322/323/331 (LTE), TS 38.321/322/323/324/331 (NR)
- **Typical topics**: RRC state machines, handover procedures, dual connectivity, carrier aggregation configuration, BWP management, QoS mapping, SIB scheduling

### RAN WG3 — RAN Architecture & Interfaces
- **Scope**: RAN internal and external interfaces — X2/Xn (inter-gNB), F1 (CU-DU split), E1 (CU-CP/CU-UP), NG (RAN to 5GC), S1 (eNB to EPC)
- **Key specs owned**: TS 36.413/423 (S1/X2-AP), TS 38.413/423/463/473 (NG/Xn/E1/F1-AP)
- **Typical topics**: CU-DU functional split, IAB (Integrated Access & Backhaul), RAN sharing, SON (Self-Organizing Networks), QoS over NG interface

### RAN WG4 — Radio Performance & RF Requirements
- **Scope**: RF requirements, radio performance requirements, UE/BS conformance specs, band definitions, coexistence studies
- **Key specs owned**: TS 36.101 (LTE UE RF), TS 36.104 (LTE BS RF), TS 38.101 (NR UE RF), TS 38.104 (NR BS RF), TS 38.133 (NR RRM)
- **Typical topics**: new frequency band definitions (n-bands for NR), coexistence between operators/RATs, RRM requirements (handover thresholds, cell reselection), OTA (Over-The-Air) test methods for massive MIMO

### RAN WG5 — Mobile Terminal Conformance Testing
- **Scope**: Test specifications for UE conformance — protocol conformance testing (PCT) and RF conformance testing
- **Key specs owned**: TS 36.521/523 (LTE conformance), TS 38.521/533 (NR conformance)
- **Typical topics**: test case development for new features, TTCN-3 test scripts, accreditation of test labs

### RAN WG6 — (Legacy) GERAN / Legacy Radio
- **Scope**: Originally GERAN (GSM/EDGE Radio Access Network) specifications
- **Status**: Largely inactive — GSM/EDGE standardization is essentially frozen. Some residual maintenance work only.

---

## SA Working Groups (summary)

| WG | Name | Key Focus |
|----|------|-----------|
| SA WG1 | Services | Service requirements, use cases (TS 22-series) |
| SA WG2 | Architecture | System architecture, 5GC NFs (TS 23-series) |
| SA WG3 | Security | Security algorithms, authentication, key management (TS 33-series) |
| SA WG4 | Codecs | Audio/video codecs, QoS for media (TS 26-series) |
| SA WG5 | Telecom Management | OAM, network management, MDT (TS 28/32-series) |
| SA WG6 | Mission Critical / Railway | MCPTT, MCVideo, FRMCS (TS 22/23-series) |

---

## CT Working Groups (summary)

| WG | Name | Key Focus |
|----|------|-----------|
| CT WG1 | MM/CC/SM (Iu) | UE-network protocols, NAS (TS 24-series) |
| CT WG3 | Interworking with External Networks | Interworking with Internet, IMS (TS 29-series) |
| CT WG4 | MAP/GTP / Charging | Diameter, GTP, charging (TS 29/32-series) |
| CT WG6 | Smart Cards | UICC, SIM, eSIM (TS 31-series) |

---

## How Work Items Flow

1. **SA WG1** defines service requirements (Stage 1)
2. **SA WG2** defines architecture (Stage 2)
3. **RAN WG1-5 + CT WG1/3/4** define protocols (Stage 3)
4. Each WG produces TSs/TRs → approved at TSG plenary → frozen into a Release

Work items can be **Study Items (SI)** → result in TR (Technical Report) or **Work Items (WI)** → result in TS (Technical Specification).
