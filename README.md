# 3GPP Expert Skill for Claude

A comprehensive 3GPP telecommunications skill that turns Claude into a senior telecom consultant — covering everything from GSM (1992) through 6G (Release 21).

<p align="center">
  <img src="3gpp_logo.svg" alt="3GPP Logo" width="300">
</p>

## What It Does

This skill gives Claude deep, standards-grounded expertise across the full 3GPP ecosystem:

- **All generations**: 2G/GSM, 3G/UMTS, 4G/LTE, 5G NR, 5G-Advanced, 6G
- **All releases**: Phase 1 through Release 21, with detailed feature breakdowns
- **Protocol stacks**: PHY, MAC, RLC, PDCP, SDAP, RRC, NAS — with LTE vs NR differences
- **Core network**: EPC to 5GC/SBA evolution, all network functions (AMF, SMF, UPF, etc.)
- **IoT & Machine-Type Communications**: NB-IoT, LTE-M, RedCap, NIDD, SCEF/NEF, eDRX/PSM, cIoT optimizations, SGP.32 eSIM
- **Deployment**: Network planning, spectrum strategy, migration paths (NSA/SA options), O-RAN
- **Security**: Authentication (EPS-AKA, 5G-AKA), SUPI/SUCI, IMSI catcher analysis
- **Practical consulting**: Link budgets, cell planning, troubleshooting, interoperability

## Example Questions It Handles

**Deep protocol questions:**
> "Walk me through how a UE scans for and selects the best cell, from power-on to RRC Connected."

**Cross-generation comparisons:**
> "Explain the differences between LTE and 5G NR RRC state machines. What is RRC_INACTIVE?"

**Security analysis:**
> "How does 5G's SUPI/SUCI mechanism protect against IMSI catchers? What vulnerabilities remain?"

**Deployment planning:**
> "We're migrating from LTE/EPC to 5G on a budget. Walk me through the NSA vs SA options."

**IoT & cellular connectivity:**
> "Explain how NIDD works with SCEF in LTE for NB-IoT devices. How does this compare to 5G with NEF?"

> "What's the difference between CP CIoT and UP CIoT optimization? When should I use each?"

> "How do I configure PSM and eDRX for a smart meter that reports once per hour?"

## Installation

### Claude Desktop (Cowork)

1. Download `3gpp-expert.skill` from [Releases](https://github.com/lugasia/3gpp-skill/releases)
2. Open it — Claude will prompt you to install

### Manual Install

Copy the `3gpp-expert/` folder (containing `SKILL.md` and `references/`) into your Claude skills directory:

```
~/.claude/skills/3gpp-expert/
├── SKILL.md
└── references/
    └── releases.md
```

## What's Inside

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill instructions — response patterns, 7 knowledge domains (incl. IoT), when to web search |
| `references/releases.md` | Detailed release-by-release reference (Phase 1 → Rel-21) with spec series table |
| `references/iot-detailed.md` | Comprehensive IoT reference: NB-IoT, LTE-M, RedCap, NIDD, SCEF/NEF, power saving, eSIM |
| `references/diagrams/*.md` | Architecture diagrams (NIDD flows, SCEF/NEF, CIoT optimizations, eDRX/PSM) |
| `3gpp-expert.skill` | Pre-packaged installable file |

## Coverage

### Releases

| Era | Releases | Key Technologies |
|-----|----------|-----------------|
| 2G | Phase 1 – Rel-98 | GSM, GPRS, EDGE |
| 3G | Rel-99 – Rel-7 | UMTS, WCDMA, HSPA, HSPA+ |
| 4G | Rel-8 – Rel-14 | LTE, LTE-A, LTE-A Pro, NB-IoT, C-V2X |
| 5G | Rel-15 – Rel-17 | NR, 5GC/SBA, NTN, RedCap, Sidelink |
| 5G-Adv | Rel-18 – Rel-19 | AI/ML, XR, Ambient IoT, MIMO evolution |
| 6G | Rel-20 – Rel-21 | Sub-THz, ISAC, AI-native, digital twins |

### Specification Series

Covers TS 21–38 series with go-to specs for architecture (TS 23.501), NR radio (TS 38.xxx), NAS (TS 24.501), security (TS 33.501), IoT (TS 23.682, TS 36.xxx for NB-IoT/LTE-M), and more.

## IoT & Machine-Type Communications

This skill now includes **comprehensive cellular IoT coverage**:

### Technologies
- **NB-IoT (Narrowband IoT)**: 180 kHz, deep coverage, 10+ year battery life
- **LTE-M (Cat-M1)**: 1.4 MHz, VoLTE support, mobility
- **RedCap (Reduced Capability)**: 5G NR for industrial sensors, wearables, video

### Network Exposure
- **SCEF (4G)**: Service Capability Exposure Function for device triggering, monitoring, NIDD
- **NEF (5G)**: Network Exposure Function with enhanced analytics, slicing, service-based architecture
- Complete API reference and comparison tables

### Optimizations & Power Saving
- **CIoT EPS Optimizations**:
  - Control Plane (CP) CIoT: Data in NAS signaling (max 1600 bytes)
  - User Plane (UP) CIoT: RRC Suspend/Resume without full detach
- **NIDD (Non-IP Data Delivery)**: End-to-end flows for LTE and 5G
- **PSM (Power Saving Mode)**: Deep sleep, unreachable state (T3324, T3412 timers)
- **eDRX (Extended DRX)**: Extended paging cycles (20s - 2916s)

### eSIM & Provisioning
- **SGP.32**: GSMA eSIM for IoT (v1.0 through v3.0)
- Bootstrap vs operational profiles
- Remote provisioning architecture (SM-DP+, SM-DS, LPA)

### Device Management
- **OMA LwM2M** integration over 3GPP bearers
- Cross-references to [Best LwM2M Skills](https://github.com/svdwalt007/Best-LwM2M-Agentic-Skills)
- Cross-references to [Best IoT Protocols Skills](https://github.com/svdwalt007/Best-IoT-Protocols-Skills)

### Architecture Diagrams
Detailed Mermaid diagrams for:
- NIDD with LTE/SCEF and 5G/NEF
- CIoT optimization message flows (CP vs UP)
- eDRX and PSM timing diagrams
- SCEF vs NEF comparison architectures

See `references/diagrams/` for visual flows and `references/iot-detailed.md` for comprehensive coverage.

## Contributing

Contributions are welcome! If you spot an inaccuracy, want to add coverage for a specific topic, or have suggestions:

1. Open an issue describing the improvement
2. Fork the repo and submit a PR
3. Make sure any spec references are accurate and cite the correct TS/TR numbers

## Support This Project

If you find this skill useful, consider supporting its development:

- [GitHub Sponsors](https://github.com/sponsors/lugasia)
- Star this repo to help others find it

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built by [@lugasia](https://github.com/lugasia)
