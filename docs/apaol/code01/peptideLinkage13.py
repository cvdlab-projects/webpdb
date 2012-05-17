from ccdgl import *

def moleculeGraph (filename):
    """ To generate the graph (labeled on the nodes) of a CCD file. """
    residues = CCDParser (filename)
    atoms = [atom for residue in residues for atom in residue]
    nodes = [atom.get_coord().tolist() for atom in atoms]
    arcs = getPDBconnect(filename)
    labels = [atom.get_id() for residue in residues for atom in residue]
    return [nodes,arcs,labels]


def model(molecule):
    """ To generate the HPC geometry a molecule graph. """
    nodes,arcs,labels = molecule
    atoms = []
    for (node,label) in zip(nodes,labels):
        color = atom_color[label[0]]
        atom = T([1,2,3])(node)(SPHERE(0.1)([4,8]))
        atoms += [COLOR(color)(atom)]
    return STRUCT([STRUCT(atoms),MKPOL(molecule)])


def peptideTransform(hook,pivot,molecule):
    """ Affinely transforms a molecule.
        Returns the list of rotation, translation,
        HPC model and molecule's graph triple.
    """
    def transl(point):
        return T([1,2,3])([-coord for coord in point])
    vect = VECTDIFF([pivot,hook]) 
    axis = UNITVECT(VECTPROD([vect,[1,0,0]]))
    angle = ACOS(INNERPROD([UNITVECT(vect),[1,0,0]]))
    return [ROTN([angle,axis]),transl(hook),model(molecule),molecule]


def link(molecule):
    """ Second order function to transform a molecule. """
    nodes,arcs,labels = molecule
    atom_codes = [label[0] for label in labels]    
    def link0(fun0,code0,fun1,code1):
        def first(code):
            return atom_codes.index(code)
        def last(code):
            return len(atom_codes) - 1 - atom_codes[::-1].index(code)
        a0,a1 = eval(fun0)(code0),eval(fun1)(code1)
        return peptideTransform( nodes[a0],nodes[a1], molecule )
    return link0


def transform(structure):
    """ To transform a molecule structure according to the
        translation and rotation in its graph triple. """
    nodes,arcs,labels = structure[-1]
    pol = STRUCT(CAT([ structure[0:2], AA(MK)(nodes) ]))
    return [UKPOL(pol)[0],arcs,labels]

def read(peptides):
    """ To produce the list of aminoacid models. """
    def moleculeFile(peptide):
        return 'aminoacids/'+ peptide +'.pdb'
    molecules = [moleculeGraph(moleculeFile(peptide)) for peptide in peptides]
    return molecules
        
def firstPair(molecules):
    """ To link the first pair of a list of peptides. """
    N_hook = link(molecules[0])('first','N','first','H')
    O_hook = link(molecules[1])('last','O','ID',2)
    return [O_hook,N_hook]
        
def nextPeptides(molecule,previous):
    """ To chain a peptide molecule to the previous one in a polypeptide. """
    N_hook = link(transform(previous))('first','N','first','H')
    O_hook = link(molecule)('last','O','ID',2)
    return [O_hook,N_hook]

def linkPeptides(molecules):
    """ To generate the data structure needed to chain a peptide list. """
    hooks = [firstPair(molecules)]
    for k in range(2,len(molecules)):
        transformed = nextPeptides(molecules[k],hooks[0][0])
        hooks.insert(0,transformed)
    return hooks

torsion=R([2,3])(0)

def polypeptide(peptides):
    """ To chain peptide models in local coords and transformations.
        Returns an HPC model """
    molecules = read(peptides)
    structures = linkPeptides(molecules)
    out = [[[STRUCT(structures[-1][0][:3])],structures[-1][1][:-1]]]
    structures = structures[:-2]
    for structure in structures[::-1]:
        out.insert(0,[[STRUCT(structure[0][:3])],
                      [torsion],structure[1][:2]])
    return STRUCT(CAT(CAT(out)))


if __name__ == "__main__":

    peptides = ["ALA", "ARG", "ASN","ASP","CYS", "GLN", "GLU", "GLY",
                "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO",
                "SER", "THR", "TRP", "TYR", "VAL"]
    
    protein = polypeptide(peptides)            
    VIEW(protein)


