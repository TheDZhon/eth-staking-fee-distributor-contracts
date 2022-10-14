import { expect } from "chai"
import {ethers, getNamedAccounts} from "hardhat"
import {
    FeeDistributor__factory,
    FeeDistributorFactory__factory,
    FeeDistributor,
    FeeDistributorFactory
} from '../typechain-types'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("FeeDistributorFactory", function () {

    // deployer, owner of contracts
    let deployerSigner: SignerWithAddress

    const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero
    const REFERENCE_INSTANCE_SETTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REFERENCE_INSTANCE_SETTER_ROLE"))
    const INSTANCE_CREATOR_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("INSTANCE_CREATOR_ROLE"))
    const ASSET_RECOVERER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ASSET_RECOVERER_ROLE"))

    // factory contract for deploying individual FeeDistributor contract instances for each user on demand
    let feeDistributorFactory: FeeDistributorFactory

    let deployer: string
    let referenceInctanceSetter: string
    let inctanceCreator: string
    let assetRecoverer: string
    let nobody : string

    before(async () => {
        const namedAccounts = await getNamedAccounts()
        deployer = namedAccounts.deployer
        referenceInctanceSetter = namedAccounts.referenceInctanceSetter
        inctanceCreator = namedAccounts.inctanceCreator
        assetRecoverer = namedAccounts.assetRecoverer
        nobody = namedAccounts.nobody

        deployerSigner = await ethers.getSigner(deployer)

        // deploy factory contract
        const factoryFactory = new FeeDistributorFactory__factory(deployerSigner)
        feeDistributorFactory = await factoryFactory.deploy({gasLimit: 3000000})
    })

    it("deployer should get DEFAULT_ADMIN_ROLE", async function () {
        const firstAdmin = await feeDistributorFactory.getRoleMember(DEFAULT_ADMIN_ROLE, 0)
        expect(firstAdmin).to.be.equal(deployerSigner.address)

        const adminCount = await feeDistributorFactory.getRoleMemberCount(DEFAULT_ADMIN_ROLE)
        expect(adminCount).to.be.equal(1)

        const hasRole = await feeDistributorFactory.hasRole(DEFAULT_ADMIN_ROLE, deployerSigner.address)
        expect(hasRole).to.be.true

        const noRole = await feeDistributorFactory.hasRole(DEFAULT_ADMIN_ROLE, nobody)
        expect(noRole).to.be.false
    })

    it("setReferenceInstance can only be called with REFERENCE_INSTANCE_SETTER_ROLE", async function () {
        const referenceInctanceSetterSigner = await ethers.getSigner(referenceInctanceSetter)
        const factoryFactory = new FeeDistributorFactory__factory(referenceInctanceSetterSigner)
        const factorySignedByReferenceInctanceSetter = factoryFactory.attach(feeDistributorFactory.address)

        await expect(factorySignedByReferenceInctanceSetter.setReferenceInstance(nobody)).to.be.revertedWith(
            `AccessControl: account ${referenceInctanceSetter.toLowerCase()} is missing role ${REFERENCE_INSTANCE_SETTER_ROLE}`
        )

        await feeDistributorFactory.grantRole(REFERENCE_INSTANCE_SETTER_ROLE, referenceInctanceSetter)

        await factorySignedByReferenceInctanceSetter.setReferenceInstance(nobody)
    })
})