# PHY Layer Reference — 2G through 5G NR

## Table of Contents
1. [Synchronization Signals by RAT](#1-synchronization-signals-by-rat)
2. [Cell Search Procedure](#2-cell-search-procedure)
3. [Physical Channels by RAT](#3-physical-channels-by-rat)
4. [Reference Signals (LTE & NR)](#4-reference-signals-lte--nr)
5. [RACH — Preamble Sequences & Formats](#5-rach--preamble-sequences--formats)
6. [Logical / Transport / Physical Channel Mapping](#6-logical--transport--physical-channel-mapping)
7. [Key Specs per Layer](#7-key-specs-per-layer)

---

## 1. Synchronization Signals by RAT

### GSM (2G)
- No PSS/SSS concept. Synchronization via **FCCH** (Frequency Correction Channel — pure tone at f0 + 67.7 kHz) and **SCH** (Synchronization Channel — carries BSIC and TDMA frame number, uses BSIC = NCC + BCC).
- Spec: TS 45.002

### UMTS / WCDMA (3G)
- **P-SCH** (Primary Synchronization Channel): uses a single 256-chip **Golay complementary sequence** (same for all cells). Used for slot timing.
- **S-SCH** (Secondary Synchronization Channel): uses a sequence from a set of 64 **Gold sequences** (length 256), organized in a 15-slot pattern. Encodes both frame timing and scrambling code group.
- Scrambling code identified separately via CPICH correlation after sync.
- Spec: TS 25.213

### LTE (4G) — Rel-8 onward
- **PSS** (Primary Synchronization Signal):
  - Sequence type: **Zadoff-Chu (ZC)** sequences, length 63
  - Root indices: u = 25, 29, 34 → corresponding to Physical Layer Cell Identity N²_ID = 0, 1, 2
  - Mapped to 72 subcarriers (DC excluded), last 2 OFDM symbols of subframes 0 and 5
  - Same PSS in FDD and TDD (different symbol positions)
- **SSS** (Secondary Synchronization Signal):
  - Sequence type: interleaved concatenation of two **m-sequences** (length-31 each = length-62 combined)
  - Two different sequences in subframes 0 and 5 (order swapped) → enables frame timing
  - Encodes N¹_ID (0–167), giving 504 unique Physical Cell IDs
- **Cell ID formula**: PCI = 3 × N¹_ID + N²_ID
- Spec: TS 36.211, Section 6.11

### 5G NR — Rel-15 onward
- **PSS** (Primary Synchronization Signal):
  - Sequence type: **m-sequence**, length 127
  - Generator polynomial: x⁷ + x⁴ + 1
  - Cyclic shifts correspond to N²_ID = 0, 1, 2
  - Mapped to 127 subcarriers within the SS/PBCH block (SSB)
- **SSS** (Secondary Synchronization Signal):
  - Sequence type: **Gold sequence** (two length-127 m-sequences XORed)
  - Encodes N¹_ID (0–335)
  - Mapped to 127 subcarriers within SSB
- **Cell ID formula**: PCI = 3 × N¹_ID + N²_ID → 1008 unique PCIs in NR
- SSB (SS/PBCH Block) structure: PSS (symbol 0) + SSS (symbol 2) + PBCH (symbols 1,2,3)
- Spec: TS 38.211, Sections 7.4.2 (PSS) and 7.4.3 (SSS)

> ⚠️ CRITICAL DISTINCTION: In LTE PSS uses Zadoff-Chu; in NR PSS uses m-sequence. Do NOT swap these.
> ZC sequences in NR are used for PRACH preambles (not PSS/SSS).

---

## 2. Cell Search Procedure

### LTE Cell Search (TS 36.213)
1. **PSS detection** → slot/subframe timing + N²_ID (0,1,2)
2. **SSS detection** → frame timing + N¹_ID → full PCI
3. **PBCH decoding** (subframe 0, symbols 0-3 of slot 1) → MIB (bandwidth, SFN, PHICH config)
4. **SIB1 decoding** → scheduling info for other SIBs
5. **SIB2+** → access parameters, neighbor cells

### NR Cell Search (TS 38.213)
1. **SSB (SS/PBCH Block) detection**:
   - PSS → symbol/half-frame timing + N²_ID
   - SSS → frame timing + N¹_ID → full PCI
2. **PBCH decoding** → MIB (contains SFN, subcarrier offset, SSB index, DMRS config)
3. **SIB1 decoding via PDCCH/PDSCH** → ServingCellConfigCommon
4. **RRC connection** if needed

Key NR differences: SSB periodicity configurable (5/10/20/40/80/160 ms), beam-swept SSBs (up to 4/8/64 SSBs per burst set depending on frequency range).

---

## 3. Physical Channels by RAT

### LTE Physical Channels (TS 36.211)
**Downlink:**
- PBCH — Physical Broadcast Channel (MIB)
- PCFICH — Physical Control Format Indicator Channel (CFI: number of PDCCH symbols)
- PHICH — Physical Hybrid-ARQ Indicator Channel (HARQ ACK/NACK)
- PDCCH — Physical Downlink Control Channel (DCI: scheduling grants)
- EPDCCH — Enhanced PDCCH (Rel-11, localized/distributed)
- PDSCH — Physical Downlink Shared Channel (user data + SIBs)
- PMCH — Physical Multicast Channel (eMBMS)

**Uplink:**
- PUCCH — Physical Uplink Control Channel (UCI: CQI, RI, PMI, HARQ feedback)
- PUSCH — Physical Uplink Shared Channel (user data + UCI piggyback)
- PRACH — Physical Random Access Channel (preambles)

### NR Physical Channels (TS 38.211)
**Downlink:**
- PBCH — part of SSB, carries MIB
- PDCCH — DCI (scheduling, power control, SFI, etc.) — uses CCE aggregation levels 1/2/4/8/16
- PDSCH — user data, paging, RAR, SIBs
- (No PCFICH, no PHICH in NR — replaced by dynamic indication in DCI)

**Uplink:**
- PUCCH — formats 0-4 (short: 0,2; long: 1,3,4)
- PUSCH — CP-OFDM or DFT-s-OFDM
- PRACH — preamble formats (long: format 0-3; short: A1-A3, B1-B4, C0, C2)

---

## 4. Reference Signals (LTE & NR)

### LTE Reference Signals (TS 36.211)
| Signal | Purpose | Notes |
|--------|---------|-------|
| CRS | Cell-specific RS, always-on | Ports 0-3, used for channel estimation, RSRP |
| DMRS | Demodulation RS for PDSCH/PUSCH | UE-specific, precoded |
| CSI-RS | Channel state info (Rel-10+) | Up to 32 ports (Rel-13+) |
| PRS | Positioning RS (OTDOA) | Rel-9+ |
| SRS | Sounding RS (uplink) | Channel sounding for scheduling |
| MBSFN RS | eMBMS reference signal | In MBSFN subframes |

### NR Reference Signals (TS 38.211)
| Signal | Purpose | Notes |
|--------|---------|-------|
| DMRS | Demodulation for PDSCH/PDCCH/PUSCH/PUCCH | Front-loaded, type 1 & 2, configurable density |
| PT-RS | Phase tracking RS | High frequency mmWave phase noise compensation |
| CSI-RS | Channel state info + beam management | Up to 32 ports, also used for RRM/RLM/tracking |
| SRS | Uplink sounding, codebook/non-codebook | Up to 4 ports |
| PRS | Positioning RS (Rel-16+) | High density, low PCI interference |
| TRS | Tracking RS | Subset of CSI-RS for time/frequency tracking |

> NR has NO CRS (no always-on cell reference signal). This is a key design choice for energy efficiency and interference reduction. Everything is on-demand.

---

## 5. RACH — Preamble Sequences & Formats

### LTE PRACH (TS 36.211, Section 5.7)
- Preamble: **Zadoff-Chu (ZC) sequences**, length 839 (format 0-3) or length 139 (format 4)
- 64 preambles per cell (from a root ZC sequence + cyclic shifts)
- Formats 0-3: long preambles (subframe duration), different CP/GT combinations
- Format 4: short preamble, UpPTS in TDD special subframe
- PRACH configuration index selects format + periodicity

### NR PRACH (TS 38.211, Section 6.3.3)
- Preamble: **Zadoff-Chu (ZC) sequences** — same principle as LTE
  - Long formats (0-3): length-839 ZC sequences
  - Short formats (A1-A3, B1-B4, C0, C2): length-139 ZC sequences
- 64 preambles per occasion
- PRACH occasion configuration much more flexible in NR (time/frequency/beam linked)
- Msg1 (preamble) → Msg2 (RAR) → Msg3 (RRCSetupRequest) → Msg4 (RRCSetup/Contention Resolution)

> SUMMARY — Where ZC sequences are used:
> - LTE: PSS ✅, PRACH ✅
> - NR: PSS ❌ (m-sequence instead), PRACH ✅, SRS ✅

---

## 6. Logical / Transport / Physical Channel Mapping

### NR Downlink Channel Mapping (TS 38.321 / 38.211)
```
Logical           Transport         Physical
─────────────────────────────────────────────
BCCH          →   BCH           →   PBCH
BCCH          →   DL-SCH        →   PDSCH
PCCH          →   PCH           →   PDSCH
CCCH/DCCH/DTCH →  DL-SCH        →   PDSCH
                  (control)     →   PDCCH
```

### NR Uplink Channel Mapping
```
Logical           Transport         Physical
─────────────────────────────────────────────
CCCH/DCCH/DTCH →  UL-SCH        →   PUSCH
                  (control UCI) →   PUCCH
                  (random access)→  PRACH
```

---

## 7. Key Specs per Layer

| Layer | LTE Spec | NR Spec |
|-------|---------|---------|
| PHY (general) | TS 36.211 | TS 38.211 |
| PHY procedures | TS 36.213 | TS 38.213 |
| PHY multiplexing | TS 36.212 | TS 38.212 |
| MAC | TS 36.321 | TS 38.321 |
| RLC | TS 36.322 | TS 38.322 |
| PDCP | TS 36.323 | TS 38.323 |
| RRC | TS 36.331 | TS 38.331 |
| SDAP | N/A | TS 37.324 |
| NAS (EMM/ESM) | TS 24.301 | TS 24.501 (5GMM/5GSM) |
