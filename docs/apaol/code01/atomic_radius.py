from pyplasm import *


def myprint (string):
    print "\n" + string + " ->", eval(string)

atom_color = {
    'H': Color4f([0.8, 0.8, 0.8, 1.0]), # ligth gray
    'C': Color4f([0.2, 0.2, 0.2, 1.0]), # dark gray (quite black)
    'N': BLUE,
    'O': RED,
    'F': Color4f([0.0, 0.75, 1.0, 1.0]), # ligth blue
    'P': ORANGE,
    'S': YELLOW,
    'Cl': GREEN,
    'K': Color4f([200./255, 162./255, 200./255, 1.0]) # lilac
}

## http://en.wikipedia.org/wiki/Atomic_radius#Calculated_atomic_radii
## http://en.wikipedia.org/wiki/Atomic_radius#Empirically_measured_atomic_radius
## http://en.wikipedia.org/wiki/Van_der_Waals_radius
## http://en.wikipedia.org/wiki/Covalent_radius

## 0 => No data available
## units = picometers: 1.0 x 10^(-12)

RADIUS_TYPE = 3 # van der Waals
NO_CONECT = False

## atomic weight is defined as the average of atom isotopes
## (considering their frequency)

## symbol:(name, empirical, Calculated, van der Waals, covalent, atomic weight)
atomic_radius = {
    "H":("hydrogen",35,53,120,38,1.00794),
    "He":("helium",0,31,140,32,4.002602),
    "Li":("lithium",145,167,182,134,6.941),
    "Be":("beryllium",105,112,153,90,9.012182),
    "B":("boron",85,87,192,82,10.811),
    "C":("carbon",70,67,170,77,12.0107),
    "N":("nitrogen",65,56,155,75,14.0067),
    "O":("oxygen",60,48,152,73,15.9994),
    "F":("fluorine",50,42,147,71,18.9984032),
    "Ne":("neon",0,38,154,69,20.1797),
    "Na":("sodium",180,190,227,154,22.98976928),
    "Mg":("magnesium",150,145,173,130,24.3050),
    "Al":("aluminium",125,118,184,118,26.9815386),
    "Si":("silicon",110,111,210,111,28.0855),
    "P":("phosphorus",100,98,180,106,30.973762),
    "S":("sulfur",100,88,180,102,32.065),
    "Cl":("chlorine",100,79,175,99,35.453),
    "Ar":("argon",71,71,188,97,39.948),
    "K":("potassium",220,243,275,196,39.0983),
    "Ca":("calcium",180,194,231,174,40.078),
    "Sc":("scandium",160,184,211,144,44.955912),
    "Ti":("titanium",140,176,0,136,47.867),
    "V":("vanadium",135,171,0,125,50.9415),
    "Cr":("chromium",140,166,0,127,51.9961),
    "Mn":("manganese",140,161,0,139,54.938045),
    "Fe":("iron",140,156,0,125,55.845),
    "Co":("cobalt",135,152,0,126,58.933195),
    "Ni":("nickel",135,149,163,121,58.6934),
    "Cu":("copper",135,145,140,138,63.546),
    "Zn":("zinc",135,142,139,131,65.38),
    "Ga":("gallium",130,136,187,126,69.723),
    "Ge":("germanium",125,125,211,122,72.64),
    "As":("arsenic",115,114,185,119,74.92160),
    "Se":("selenium",115,103,190,116,78.96),
    "Br":("bromine",115,94,185,114,79.904),
    "Kr":("krypton",0,88,202,110,83.798),
    "Rb":("rubidium",235,265,303,211,85.4678),
    "Sr":("strontium",200,219,249,192,87.62),
    "Y":("yttrium",180,212,0,162,88.90585),
    "Zr":("zirconium",155,206,0,148,91.224),
    "Nb":("niobium",145,198,0,137,92.90638),
    "Mo":("molybdenum",145,190,0,145,95.96),
    "Tc":("technetium",135,183,0,156,98),
    "Ru":("ruthenium",130,178,0,126,101.07),
    "Rh":("rhodium",135,173,0,135,102.90550),
    "Pd":("palladium",140,169,163,131,106.42),
    "Ag":("silver",160,165,172,153,107.8682),
    "Cd":("cadmium",155,161,158,148,112.411),
    "In":("indium",155,156,193,144,114.818),
    "Sn":("tin",145,145,217,141,118.710),
    "Sb":("antimony",145,133,206,138,121.760),
    "Te":("tellurium",140,123,206,135,127.60),
    "I":("iodine",140,115,198,133,126.90447),
    "Xe":("xenon",0,108,216,130,131.293),
    "Cs":("caesium",260,298,343,225,132.9054519),
    "Ba":("barium",215,253,268,198,137.327),
    "La":("lanthanum",195,0,0,169,138.90547),
    "Ce":("cerium",185,0,0,0,140.116),
    "Pr":("praseodymium",185,247,0,0,140.90765),
    "Nd":("neodymium",185,206,0,0,144.242),
    "Pm":("promethium",185,205,0,0,145),
    "Sm":("samarium",185,238,0,0,150.36),
    "Eu":("europium",185,231,0,0,151.964),
    "Gd":("gadolinium",180,233,0,0,157.25),
    "Tb":("dysprosium",175,228,0,0,158.92535),
    "Dy":("dysprosium",175,228,0,0,162.500),
    "Ho":("holmium",175,0,0,0,164.93032),
    "Er":("erbium",175,226,0,0,167.259),
    "Tm":("thulium",175,222,0,0,168.93421),
    "Yb":("ytterbium",175,222,0,0,173.054),
    "Lu":("lutetium",175,217,0,160,174.9668),
    "Hf":("hafnium",155,208,0,150,178.49),
    "Ta":("tantalum",145,200,0,138,180.94788),
    "W":("tungsten",135,193,0,146,183.84),
    "Re":("rhenium",135,188,0,159,186.207),
    "Os":("osmium",130,185,0,128,190.23),
    "Ir":("iridium",135,180,0,137,192.217),
    "Pt":("platinum",135,177,175,128,195.084),
    "Au":("gold",135,174,166,144,196.966569),
    "Hg":("mercury",150,171,155,149,200.59),
    "Tl":("thallium",190,156,196,148,204.3833),
    "Pb":("lead",180,154,202,147,207.2),
    "Bi":("bismuth",160,143,207,146,208.98040),
    "Po":("polonium",190,135,197,0,209),
    "At":("astatine",0,0,202,0,210),
    "Rn":("radon",0,120,220,145,222),
    "Fr":("francium",0,0,348,0,223),
    "Ra":("radium",215,0,283,0,226),
    "Ac":("actinium",195,0,0,0,227),
    "Th":("thorium",180,0,0,0,232.03806),
    "Pa":("protactinium",180,0,0,0,231.03588),
    "U":("uranium",175,0,186,0,238.02891),
    "Np":("neptunium",175,0,0,0,237),
    "Pu":("plutonium",175,0,0,0,244),
    "Am":("americium",175,0,0,0,243),
    "Cm":("curium",0,0,0,0,247),
    "Bk":("berkelium",0,0,0,0,247),
    "Cf":("californium",0,0,0,0,251),
    "Es":("einsteinium",0,0,0,0,252),
    "Fm":("fermium",0,0,0,0,257),
    "Md":("mendelevium",0,0,0,0,258),
    "No":("nobelium",0,0,0,0,259),
    "Lr":("lawrencium",0,0,0,0,262),
    "Rf":("rutherfordium",0,0,0,0,265),
    "Db":("dubnium",0,0,0,0,268),
    "Sg":("seaborgium",0,0,0,0,271),
    "Bh":("bohrium",0,0,0,0,272),
    "Hs":("hassium",0,0,0,0,270),
    "Mt":("meitnerium",0,0,0,0,276),
    "Ds":("darmstadtium",0,0,0,0,281),
    "Rg":("roentgenium",0,0,0,0,280),
    "Cn":("copernicium",0,0,0,0,285),
    "Uut":("ununtrium",0,0,0,0,284),
    "Uuq":("ununquadium",0,0,0,0,289),
    "Uup":("ununpentium",0,0,0,0,288),
    "Uuh":("ununhexium",0,0,0,0,293)
           }

if __name__ == "__main__":
    myprint("atomic_radius['H']")
    myprint("atomic_radius['H'][RADIUS_TYPE]")
